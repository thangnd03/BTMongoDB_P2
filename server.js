const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const expHbs = require('express-handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('.hbs', expHbs.engine({ extname: '.hbs', helpers: { sum: (a, b) => a + b } }));
app.set('view engine', '.hbs');
app.set('views', './views');

const mongoose = require('mongoose');

const uri = 'mongodb+srv://nguyenthang070103:thanglodc123@cp17303.8hgo261.mongodb.net/?retryWrites=true&w=majority';

const SanPhamModel = require('./SanPhamModel');
const { multipleMongooseToObject, mongooseToObject } = require('./mongoose');

app.get('/', async (req, res) => {
    await mongoose.connect(uri);

    console.log('Ket noi DB thanh cong!');

    let arrSP = await SanPhamModel.find();

    console.log(arrSP);

    res.render('listSP', { arrSP: multipleMongooseToObject(arrSP) });

})

app.post('/add_sp', async (req, res) => {
    await mongoose.connect(uri);

    console.log('Ket noi DB thanh cong!');

    let spMoi = req.body;

    let kq = await SanPhamModel.insertMany(spMoi);

    console.log(kq);

    res.redirect('/');
});

app.get('/update_sp/:_id', async (req, res) => {
    await mongoose.connect(uri);
    console.log('Ket noi DB thanh cong!');
    let sp = await SanPhamModel.findById(req.params._id);
    console.log(sp);
    res.render('updateSP', { sp: mongooseToObject(sp) });
});

app.post('/update_sp/:_id', async (req, res) => {
    console.log(req.body);
    await SanPhamModel.updateOne({_id:req.params._id},req.body);
    console.log("Sửa thành công");
    res.redirect('/');
});

app.post('/delete_sp/:_id',async(req,res) => {
    console.log(req.params._id);
    await SanPhamModel.deleteOne({_id:req.params._id});
    console.log('Xóa thành công');
    res.redirect('back');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

