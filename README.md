## Env

First, create a .env file and fill in the settings information based on the .env.example file.


## Installation

```bash
$ yarn install
```

## Running the app

```bash

# seeder

$ yarn run seed

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Kampanya Oluşturma

If you are going to offer a "Buy X, Get Y" style promotion, then:

```javascript
{
  "campaign_id": 3,
  "campaign_name": "test",
  "discount_rate": 20,
  "min_order_amount": 100,
  "min_product_count": -1,
  "author_name": "",
  "category_id": -1
}
```

If you are going to provide a %Y discount for purchases of X TL or more, then:

```javascript
{
  "campaign_id": 3,
  "campaign_name": "test",
  "discount_rate": -1,
  "min_order_amount": -1,
  "min_product_count": 2,
  "author_name": "Sabahattin Ali",
  "category_id": 1
}
```

### For Swagger: http://localhost:3000/swagger
