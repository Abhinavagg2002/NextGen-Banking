const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./schemas/userInfo");
const Trans = require("./schemas/trans");

dotenv.config({ path: './config.env'});

const salt = bcrypt.genSaltSync(10);
db = process.env.DATABASE;
secret = process.env.SECRET;
port = process.env.PORT;

let bank_money = 100000;

const app = express();
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(db)
.then(()=> console.log("monogdb connected"))
.catch((err)=>console.log("not connected"));

app.post('/register',async (req,res)=>{
    const {username,sid,password,cp,email,created_at} = req.body
    console.log(username,sid,password,email,created_at)
    if(!username || !sid || !password || !cp || !email){
        return res.status(400).json('please enter valid data')
    }
    else if(password != cp){
        return res.status(400).json('wrong password.')
    }

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', numbers = '0123456789';
    let account_no = '';
    while(true){
        account_no = '';
        for (let i = 0; i < 2; i++) {
          const randomIndex = Math.floor(Math.random() * 10);
          console.log(randomIndex)
          account_no += numbers.charAt(randomIndex);
        }
        for (let i = 0; i < 4; i++) {
          const randomIndex = Math.floor(Math.random() * 26);
          console.log(randomIndex)
          account_no += characters.charAt(randomIndex);
        }
        const find_id = await User.findOne({account_no})
        if(!find_id){
            break;
        }
    }   

    const findUser = await User.findOne({sid})
    console.log(account_no)
    
    if(!findUser){
      try{
        const userDoc = await User.create({username,account_no,sid,password:bcrypt.hashSync(password,salt),email,created_at,amount:0,loanAmount:0})
        const options = { upsert: true, new: true };
        const transDoc = await Trans.create({account_no},{$push:{history:{date:created_at,type:"account created"}}},options)
        res.status(200).json("successfully registered.")
      }catch(e){
          res.status(400).json('Sorry, not able to register')
      }
    }
    else{
      res.status(404).json('User already exists') 
    }
    
})

app.post('/login',async (req,res)=>{
    const {sid,password} = req.body
    const userDoc = await User.findOne({sid} )
    if(!userDoc){
        return res.status(400).json({error:'wrong credentials'})
    }
    const passOk = bcrypt.compareSync(password,userDoc.password) 
    if(passOk){
        const data = {id:userDoc._id,
            username:userDoc.username,
            sid:userDoc.sid,
            email:userDoc.email,
            account_no:userDoc.account_no,
            created_at:userDoc.created_at,
            account_no:userDoc.account_no}
        return res.json(data);

        jwt.sign({phone,id:userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err
            res.cookie('token', token).json({
                id:userDoc._id,
                username:userDoc.username,
                phone:userDoc.phone,
                email:userDoc.email,
                account_no:userDoc.account_no,
                created_at:userDoc.created_at,
            })
        })
    }else{
        return res.status(400).json({error:'wrong credentials'})
    }
})


app.patch('/deposit', async(req,res) =>{
    const {id,amount,password,date} = req.body;
    //let date2 = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    //const date2 = date.toLocaleDateString();
    console.log(id,amount,password,date);
    const amount2 = parseInt(amount);
    if(amount2 < 0){
        return res.status(400).json({error:"enter valid amount"})
    }
    try {
        const userDoc = await User.findById(id);
        
        const passOk = bcrypt.compareSync(password,userDoc.password) 
        if(!passOk){
            return res.status(400).json({error:"incorrect password"})
        }
        const x = userDoc.amount +amount2
        const item = await User.findByIdAndUpdate(id, { amount: x}, {new: true})
        console.log("amount updated")
        if(!item){
            return res.status(404).json({ error: 'Transaction not found' });
        }
        else{
            bank_money += amount2*0.2

            const query = { account_no: userDoc.account_no };
            const update = {
                $push: {
                    history: {
                    date: date,
                    type: "deposit",
                    amount: amount2
                    }
                }
            };
            const options = { upsert: true, new: true };
            const updatedDoc = await Trans.findOneAndUpdate(query, update, options);
            console.log("transaction doc updated")
        }
    
        return res.json(item);
        
    }catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.patch('/withdrawl', async(req,res)=>{
    const {id,amount,password,date} = req.body;
    

    const amount2 = parseInt(amount);
    if(amount2 < 0){
        return res.status(400).json({error:"enter valid amount"})
    }
    try{
        const userDoc = await User.findById(id)
        const passOk = bcrypt.compareSync(password,userDoc.password) 
        if(!passOk){
            return res.status(400).json({error:"incorrect password"})
        }
        if(userDoc.amount >= amount2){
            const x = userDoc.amount - amount2
            const item = await User.findByIdAndUpdate(id ,{amount: x} , {new:true})
            console.log("amount updated")
            if(!item){
                return res.status(404).json({ error: 'Transaction not found' });
            }
            else{
                bank_money -= amount*0.2;
                const query = { account_no: userDoc.account_no };
                const update = {
                    $push: {
                        history: {
                        date: date,
                        type: "withdawl",
                        amount: amount2
                        }
                    }
                };
                const options = { upsert: true, new: true };
                const updatedDoc = await Trans.findOneAndUpdate(query, update, options);
                console.log("transaction doc updated")
            }
            return res.json(item);
        }
        else{
            return res.status(400).json({error:"insufficient funds"})
        }
    }catch(error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.patch('/transfer', async(req,res)=>{
    const {id,amount,account_no,password,date} = req.body;

    const amount2 = parseInt(amount);
    if(amount2 < 0){
        return res.status(400).json("enter valid amount")
    }
    try {
        const payer = await User.findById(id)
        const passOk = bcrypt.compareSync(password,payer.password) 
        if(!passOk){
            return res.status(400).json({error:"incorrect password"})
        }
        const payee = await User.findOne({account_no})
        if(payee){
            if(payer.amount >= amount){
                const x = payee.amount + amount2
                const y = payer.amount - amount2 
                const item1 = await User.findByIdAndUpdate(id, {amount: y}, {new :true})
                console.log(" item1 updated")
                const item2 = await User.findByIdAndUpdate(payee._id, {amount: x}, {new :true})
                console.log(" item2 updated")
                if(!item1 || !item2){
                    return res.status(404).json({ error: 'Transaction not found' });
                }
                else{
                    const query1 = { account_no: payer.account_no };
                    const update1 = {
                        $push: {
                            history: {
                                date: date,
                                type: `transfer to ${payee.account_no}`,
                                amount: amount2
                            }
                        }
                    };
                    const options = { upsert: true, new: true };
                    const new1Doc = await Trans.findOneAndUpdate(query1, update1, options);
                    console.log("transaction doc1 updated")
                    const query2 = { account_no: payee.account_no };
                    const update2 = {
                        $push: {
                            history: {
                                date: date,
                                type: `transfer from ${payer.account_no}`,
                                amount: amount2
                            }
                        }
                    };
                    const new2Doc = await Trans.findOneAndUpdate(query2, update2, options);
                    console.log("transaction doc2 updated")
                }
                return res.json({item1,item2});
            }
            else{
                return res.status(400).json({error:"insufficient funds"})
            }
        }
        else{
            return res.status(404).json({error:"no such accout no"})
        }
        
    }catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/history', async(req,res)=>{
    const {account_no} = req.body;
    try{
        const transDoc = await Trans.findOne({account_no});
        if(transDoc){
            return res.status(200).json(transDoc.history)
        }
        else{
            return res.status(404).json({error:"no such accout no."})
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    
})

app.post('/loan', async(req,res)=>{

    const {id,amount,password,date} = req.body;
    const familyIncome = req.body.famInc;
    console.log(id,amount,password,date);
    const amount2 = parseInt(amount);

    if(amount2 < 0){
        return res.status(400).json({error:"enter valid amount"})
    }
    try{
        const userDoc = await User.findById(id);
        
        const passOk = bcrypt.compareSync(password,userDoc.password) 
        if(!passOk){
            return res.status(400).json({error:"incorrect password"})
        }
        
        const sid = userDoc.sid;
         year = sid.slice(1, 2);
         console.log(year)
        if(year === '0') age=4;
        else if(year === '1') age=3;
        else if(year === '2') age=2;
        else if(year === '3') age=1;

        let maxLoan,interestRate;
        if (age === 1) {
            if (familyIncome > 800000) {
            maxLoan = 50000;
            interestRate = 0.05;
            } else if (familyIncome < 800000 && familyIncome > 200000) {
            maxLoan = 30000;
            interestRate = 0.05;
            } else {
            return res.status(400).json({ error: 'Not applicable for a loan with income < 800000' });
            }
        } else if (age === 2) {
            if (familyIncome > 800000) {
            maxLoan = 50000;
            interestRate = 0.04;
            } else if (familyIncome < 800000 && familyIncome > 200000) {
            maxLoan = 30000;
            interestRate = 0.04;
            } else {
            return res.status(400).json({ error: 'Not applicable for a loan with income < 800000' });
            }
        } else if (age === 3) {
            if (familyIncome > 800000) {
            maxLoan = 50000;
            interestRate = 0.03;
            } else if (familyIncome < 800000 && familyIncome > 200000) {
            maxLoan = 30000;
            interestRate = 0.03;
            } else {
            return res.status(400).json({ error: 'Not applicable for a loan with income < 800000' });
            }
        } else if (age === 4) {
            if (familyIncome > 800000) {
            maxLoan = 50000;
            interestRate = 0.02;
            } else if (familyIncome < 800000 && familyIncome > 200000) {
            maxLoan = 30000;
            interestRate = 0.02;
            } else {
            return res.status(400).json({ error: 'Not applicable for a loan with income < 800000' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid age' });
        }
        if(maxLoan < amount2){
            return res.status(400).json({error :'Not eligible for this much loan amount'})
        }
        const x = userDoc.loanAmount +amount2
        const item = await User.findByIdAndUpdate(id, { loanAmount: x}, {new: true})
        console.log("amount updated")
        if(!item){
            return res.status(404).json({ error: 'Transaction not found' });
        }
        else{

            const query = { account_no: userDoc.account_no };
            const update = {
                $push: {
                    history: {
                    date: date,
                    type: "loan",
                    amount: amount2
                    }
                }
            };
            const options = { upsert: true, new: true };
            const updatedDoc = await Trans.findOneAndUpdate(query, update, options);
            console.log("transaction doc updated")
        }
    
        return res.json(item);

    }
    catch(error){
        console.log(error)
        res.status(500).json({error: 'Internal Server Error'})
    }
})

app.post('/amount',async(req,res)=>{
    const {account_no} = req.body
    try{
        const doc = await User.findOne({account_no});
        const amount = doc.amount, loan = doc.loanAmount;
        if(doc){
            console.log(amount,loan)
            return res.status(200).json([amount,loan])
        }
        else{
            return res.status(404).json({error:"no such accout no."})
        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({error: 'Internal Server Error'})
    }
})

app.listen(port,()=>{
    console.log('server is running on', port)
})