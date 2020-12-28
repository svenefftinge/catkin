import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ItemsModule } from '../../src/items/items.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { Item } from '../../src/items/interfaces/item.interface';
import { ItemInput } from 'dist/items/input-items.input';

describe('ItemsController (e2e)', () => {

  beforeAll(async () => {
  });

  afterAll(async () => {
  });

  const item: ItemInput = {
    title: 'Great item',
    estimate: 10,
    description: 'Description of this great item',
    personas: [],
    group: ''
  };

  let id: string = '';

  const updatedItem: ItemInput = {
    title: 'Great updated item',
    estimate: 20,
    description: 'Updated description of this great item',
    personas: [],
    group: ''
  };

  const createitemObject = JSON.stringify(item).replace(
    /\"([^(\")"]+)\":/g,
    '$1:',
  );

  const createItemQuery = `
  mutation {
    createItem(input: ${createitemObject}) {
      title
      estimate
      description
      id,
      personas,
      groups
    }
  }`;

  it('createItem', async () => {
     const res = await request(global.app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: createItemQuery,
      })
        const data = res.body.data.createItem;
        id = data.id;
        expect(data.title).toBe(item.title);
        expect(data.description).toBe(item.description);
        expect(data.estimate).toBe(item.estimate);
      
  });

  it('getItems', async () => {
    const res = await request(global.app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: '{items{title, estimate, description, id}}',
      })
        const data = res.body.data.items;
        const itemResult = data[0];
        expect(data.length).toBeGreaterThan(0);
        expect(itemResult.title).toBe(item.title);
        expect(itemResult.description).toBe(item.description);
        expect(itemResult.estimate).toBe(item.estimate);
  });

  const updateItemObject = JSON.stringify(updatedItem).replace(
    /\"([^(\")"]+)\":/g,
    '$1:',
  );

  it('updateItem', async () => {
    const updateItemQuery = `
    mutation {
      updateItem(id: "${id}", input: ${updateItemObject}) {
        title
        estimate
        description
        id
      }
    }`;

    const res = await request(global.app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: updateItemQuery,
      })
        const data = res.body.data.updateItem;
        expect(data.title).toBe(updatedItem.title);
        expect(data.description).toBe(updatedItem.description);
        expect(data.estimate).toBe(updatedItem.estimate);
      
  });

  it('deleteItem', async () => {
    const deleteItemQuery = `
      mutation {
        deleteItem(id: "${id}") {
          title
          estimate
          description
          id
        }
      }`;

    const res = await request(global.app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: deleteItemQuery,
      })

      const data = res.body.data.deleteItem;
        expect(data.title).toBe(updatedItem.title);
        expect(data.description).toBe(updatedItem.description);
        expect(data.estimate).toBe(updatedItem.estimate);
  });
});