CREATE TABLE Customer (
  customerID SERIAL PRIMARY KEY,
  customerFirstName VARCHAR(255) NOT NULL,
  customerLastName VARCHAR(255) NOT NULL
);

INSERT INTO Customer (customerID, customerFirstName, customerLastName)
VALUES  ('001', 'Cheezy','Avocado'),
        ('002', 'Nattharika','Saetang');