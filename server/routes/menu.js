const express = require('express');
const { pool } = require('../config')

const router = express.Router();

router.get('/',(req,res)=>{
    res.send('in route menu')
})

router.get('/getFoods',(req,res)=>{
    pool.query('SELECT * FROM food', (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
});

router.post('/addFoods',(req,res)=>{
    const query = 'INSERT INTO food (foodID, foodName, price, foodImage) VALUES (\'1\',\'Prawn Pad Thai\',\'150\',\'url1\')'
    pool.query(query, (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send('added new food items');
    })
});

router.get('/getAmenities',(req,res)=>{
    pool.query('SELECT * FROM amenity', (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
});

router.post('/addAmenities',(req,res)=>{
    const query = 'INSERT INTO food (amenityID, amenityName, amenityIcon) VALUES (\'1\',\'Shampoo\',\'url1\')'
    pool.query(query, (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send('added new amenity items');
    })
});

module.exports = router;