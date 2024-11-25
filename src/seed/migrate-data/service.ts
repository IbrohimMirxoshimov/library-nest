import { Injectable } from '@nestjs/common';
import { BookImportance, StockStatus, UserStatus } from '@prisma/client';
import { Pool } from 'pg';
import { Permissions } from 'src/common/constants/constants.permissions';
import { app_config } from 'src/config/app.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { arrayToMap } from 'src/utils/object.utils';
import {
  capitalizeFirstLetter,
  onlyAbcLowercase,
} from 'src/utils/string.utils';

function fixStringFields(str: string) {
  if (str) {
    return capitalizeFirstLetter(str.trim().replace(/[ʻ`’]/g, "'"));
  }

  return str;
}

@Injectable()
export class MigrationOldDataService {
  private oldDb: Pool;

  constructor(private prisma: PrismaService) {
    this.oldDb = new Pool({
      connectionString: app_config.old_database_url,
    });
  }

  async migrateAll() {
    // await this.migrateRegions();
    // await this.migrateAddresses();
    // await this.migrateLocations();
    // await this.migrateUsers();
    // await this.migrateAuthors();
    // await this.migrateCollections();
    // await this.migrateBooks();
    // await this.migrateStocks();
    // await this.migrateRents();
    // await this.migrateComments();
    await this.migratePublishings();
    
    // TODO
    // await this.migrateSMSBulks();
    // await this.migrateSMS();
  }

  private async migrateRegions() {
    const { rows: oldRegions } = await this.oldDb.query(
      'SELECT * FROM regions',
    );
    const { rows: oldTowns } = await this.oldDb.query('SELECT * FROM towns');

    for (const region of oldRegions) {
      await this.prisma.region.upsert({
        where: { id: region.id },
        create: {
          id: region.id,
          name: fixStringFields(region.name),
          created_at: region.createdAt,
          updated_at: region.updatedAt,
          deleted_at: region.deletedAt,
        },
        update: {},
      });
    }

    for (const town of oldTowns) {
      await this.prisma.region.upsert({
        where: { id: town.id },
        create: {
          id: town.id,
          name: fixStringFields(town.name),
          parent_id: town.regionId,
          created_at: town.createdAt,
          updated_at: town.updatedAt,
          deleted_at: town.deletedAt,
        },
        update: {},
      });
    }
  }

  private async migrateAddresses() {
    const { rows: addresses } = await this.oldDb.query(
      'SELECT * FROM addresses',
    );

    const regions_map_id = arrayToMap(
      await this.prisma.region.findMany(),
      (r) => r.id,
    );
    const regions_map_name = arrayToMap(
      await this.prisma.region.findMany(),
      (r) => r.name,
    );

    const mapping_not_founds: any = {
      'Toshkent sh.': 'Toshkent shahri',
      'Xorazim ': 'Xorazm',
    };

    function getId(name_or_id: string) {
      if (Number(name_or_id)) {
        return regions_map_id[name_or_id]?.id;
      }

      return (
        regions_map_name[fixStringFields(name_or_id)] ||
        regions_map_name[mapping_not_founds[name_or_id]]
      )?.id;
    }

    for (const address of addresses) {
      await this.prisma.address.upsert({
        where: { id: address.id },
        create: {
          id: address.id,
          address_line: address.addressLine,
          latitude: address.latitude,
          longitude: address.longitude,
          created_at: address.createdAt,
          updated_at: address.updatedAt,
          country_code: address.countryCode,
          street: address.street,
          home: address.home,
          region_id: getId(address.region),
          sub_region_id: getId(address.town),
        },
        update: {},
      });
    }
  }

  private async migrateUsers() {
    const { rows: users } = await this.oldDb.query('SELECT * FROM users');

    await this.prisma.$transaction(
      async (tx) => {
        const owner = await tx.role.upsert({
          create: {
            name: 'owner',
            id: 1,
            permissions: Object.values(Permissions),
          },
          where: {
            id: 1,
          },
          update: {},
        });

        const roles = arrayToMap(
          await Promise.all(
            users
              .filter((u) => {
                return u.librarian || u.owner;
              })
              .map(async (u) => {
                {
                  return { user_id: u.id, role_id: await getRole(u) };
                }
              }),
          ),
          (i) => i.user_id,
        );

        await tx.user.create({
          data: {
            first_name: 'Admin',
            role_id: owner.id,
          },
        });

        async function getRole(user: any) {
          if (user.librarian && user.libraryId) {
            const role = await tx.role.create({
              data: {
                name: 'Librarian ' + user.firstName,
                location_id: user.libraryId,
              },
            });

            return role.id;
          }
        }
        await tx.user.createMany({
          data: users.map((user) => {
            return {
              id: user.id,
              first_name: fixStringFields(user.firstName.toLowerCase()),
              last_name: fixStringFields(user.lastName?.toLowerCase() || ''),
              phone: '998' + user.phone,
              extra: user.extra,
              gender: user.gender,
              birth_date: user.birthDate,
              phone_verified: user.phoneVerified,
              telegram_id: user.telegramId,
              passport_id: user.passportId,
              passport_image: user.passportImage,
              created_at: user.createdAt,
              updated_at: user.updatedAt,
              deleted_at: user.deletedAt,
              extra_phone: user.extraPhone,
              passport_pin: user.pinfl,
              status:
                user.status === 1 ? UserStatus.ACTIVE : UserStatus.BLOCKED,
              balance: user.balance,
              blocking_reason: user.blockingReason,
              address_id: user.addressId,
              role_id: roles[user.id]?.role_id,
              registered_locations: user.locationId
                ? [user.locationId]
                : undefined,
            };
          }),
          skipDuplicates: true,
        });
      },
      {
        timeout: 200 * 1000,
      },
    );

    console.log(users.length, await this.prisma.user.count());
  }

  private async migrateLocations() {
    const { rows: locations } = await this.oldDb.query(
      'SELECT * FROM locations',
    );

    await this.prisma.$transaction(async (tx) => {
      for (const location of locations) {
        await tx.location
          .upsert({
            where: { id: location.id },
            create: {
              id: location.id,
              name: location.name,
              description: location.description,
              created_at: location.createdAt,
              updated_at: location.updatedAt,
              deleted_at: location.deletedAt,
              active: location.active,
              link: location.link,
              region_id: location.regionId,
            },
            update: {},
          })
          .catch((e) => {
            console.log(location);

            throw e;
          });
      }
    });

    console.log(locations.length, await this.prisma.location.count());
  }

  private async migrateAuthors() {
    const { rows: authors } = await this.oldDb.query('SELECT * FROM authors');

    for (const author of authors) {
      await this.prisma.author.upsert({
        where: { id: author.id },
        create: {
          id: author.id,
          name: fixStringFields(author.name),
          created_at: author.createdAt,
          updated_at: author.updatedAt,
          deleted_at: author.deletedAt,
          creator_id: author.creatorId,
        },
        update: {},
      });
    }

    console.log(authors.length, await this.prisma.author.count());
  }

  private async migrateCollections() {
    const { rows: collections } = await this.oldDb.query(
      'SELECT * FROM collections',
    );

    for (const collection of collections) {
      await this.prisma.collection.upsert({
        where: { id: collection.id },
        create: {
          id: collection.id,
          name: collection.name,
          sort: collection.sort,
          created_at: collection.createdAt,
          updated_at: collection.updatedAt,
          deleted_at: collection.deletedAt,
        },
        update: {},
      });
    }

    console.log(collections.length, await this.prisma.collection.count());
  }

  private async migrateBooks() {
    const { rows: books } = await this.oldDb.query('SELECT * FROM books');
    const author_map = arrayToMap(
      await this.prisma.author.findMany(),
      (a) => a.id,
    );
    await this.prisma.$transaction(async (tx) => {
      for (const book of books) {
        try {
          await tx.book.upsert({
            where: { id: book.id },
            create: {
              id: book.id,
              name: capitalizeFirstLetter(book.name.trim()),
              searchable_name: onlyAbcLowercase(
                book.name + ' ' + (author_map[book.authorId]?.name || ''),
              ),
              description: book.description,
              image: book.image,
              rent_duration: book.rentDuration,
              pages: book.pages,
              sort: book.sort,
              created_at: book.createdAt,
              updated_at: book.updatedAt,
              deleted_at: book.deletedAt,
              author_id: book.authorId,
              collection_id: book.collectionId,
              isbn: book.isbn,
              importance:
                book.few === 0
                  ? BookImportance.NOT_NECESSARY
                  : book.few === 1
                    ? BookImportance.NECESSARY
                    : undefined,
              language: book.language,
            },
            update: {},
          });
        } catch (error) {
          console.log(book);

          throw error;
        }
      }
    });

    console.log(books.length, await this.prisma.book.count());
  }

  private async migrateStocks() {
    const { rows: stocks } = await this.oldDb.query('SELECT * FROM stocks');

    await this.prisma.$transaction(async (tx) => {
      await tx.stock.createMany({
        data: stocks
          .filter((s) => s.bookId)
          .map((stock) => {
            return {
              id: stock.id,
              busy: stock.busy,
              created_at: stock.createdAt,
              updated_at: stock.updatedAt,
              location_id: stock.locationId,
              deleted_at: stock.deletedAt,
              status: stock.deletedAt
                ? StockStatus.INACTIVE
                : StockStatus.ACTIVE,
              book_id: stock.bookId,
            };
          }),
        skipDuplicates: true,
      });
    });

    console.log('stocks', stocks.length, await this.prisma.stock.count());
  }

  private async migrateRents() {
    const { rows: rents } = await this.oldDb.query('SELECT * FROM rents');

    const users = await this.prisma.user.findMany({
      where: {
        phone: { not: null },
      },
    });

    const usersmap = arrayToMap(users, (u) => u.id);
    const actual_insert = rents.filter((r) => r.userId);

    await this.prisma.$transaction(
      async (tx) => {
        await tx.rent.createMany({
          data: actual_insert.map((rent) => {
            return {
              id: rent.id,
              rented_at: rent.leasedAt,
              due_date: rent.returningDate,
              created_at: rent.createdAt,
              updated_at: rent.updatedAt,
              deleted_at: rent.deletedAt,
              custom_id: rent.customId,
              rejected: rent.rejected || false,
              returned_at: rent.returnedAt,
              customer_id: rent.userId,
              librarian_id: 1,
              stock_id: rent.stockId,
              location_id: usersmap[rent.userId].registered_locations[0],
            };
          }),
          skipDuplicates: true,
        });

        if (actual_insert.length !== (await tx.rent.count())) {
          throw new Error('no match');
        }
      },
      {
        timeout: 10000,
      },
    );

    console.log('matched');
  }

  private async migrateComments() {
    const { rows } = await this.oldDb.query('SELECT * FROM comments');
    await this.prisma.$transaction(
      async (tx) => {
        await tx.comment.createMany({
          data: rows.map((comment) => {
            return {
              id: comment.id,
              text: comment.text,
              created_at: comment.createdAt,
              updated_at: comment.updatedAt,
              rent_id: comment.rentId,
              user_id: 1,
            };
          }),
        });

        if (rows.length !== (await tx.comment.count())) {
          throw new Error(
            'no match ' + rows.length + ' ' + (await tx.comment.count()),
          );
        }
      },
      {
        timeout: 10000,
      },
    );

    console.log('matched');
  }
  private async migratePublishings() {
    const { rows } = await this.oldDb.query('SELECT * FROM publishings');
    await this.prisma.$transaction(
      async (tx) => {
        await tx.publishing.createMany({
          data: rows.map((publishing) => {
            return {
              id: publishing.id,
              name: publishing.name,
              created_at: publishing.createdAt,
              updated_at: publishing.updatedAt,
            };
          }),
        });

        if (rows.length !== (await tx.publishing.count())) {
          throw new Error(
            'no match ' + rows.length + ' ' + (await tx.publishing.count()),
          );
        }
      },
      {
        timeout: 10000,
      },
    );

    console.log('matched');
  }

  private async migrateSMSBulks() {
    const { rows } = await this.oldDb.query('SELECT * FROM smsbulks');
    await this.prisma.$transaction(
      async (tx) => {
        await tx.sms_bulk.createMany({
          data: rows.map((item) => {
            return {
              id: item.id,
              text: item.text,
              created_at: item.createdAt,
              updated_at: item.updatedAt,
              deleted_at: item.deletedAt,
              user_id: item.userId,
            };
          }),
        });

        if (rows.length !== (await tx.rent.count())) {
          throw new Error('no match');
        }
      },
      {
        timeout: 10000,
      },
    );

    console.log('matched');
  }

  private async migrateSMS() {
    const { rows } = await this.oldDb.query('SELECT * FROM sms');
    await this.prisma.$transaction(
      async (tx) => {
        await tx.sms.createMany({
          data: rows.map((sms) => {
            return {
              id: sms.id,
              phone: sms.phone,
              status: parseInt(sms.status) || 0,
              user_id: sms.userId,
              sms_bulk_id: sms.smsbulkId,
              text: sms.text,
              provider: sms.provider,
              provider_message_id: sms.provider_message_id,
              error_reason: sms.error_reason,
            };
          }),
        });

        if (rows.length !== (await tx.rent.count())) {
          throw new Error('no match');
        }
      },
      {
        timeout: 10000,
      },
    );

    console.log('matched');
  }
}
