const { Result } = require('express-validator');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

const readSession = async () => {
    try {
        const res = await client.query('SELECT * FROM wa_session ORDER BY created_at DESC LIMIT 1')
        if(res.rows.length) return res.rows[0].session;
        return '';
    } catch (err) {
        throw err;
    }
}

const saveSession = (session) => {
    client.query('INSERT INTO wa_session (session) VALUES($1)', [session], (err,result) => {
        if (err){
            console.error('Failed to save session', err);
        }else{
            console.log('Session saved!');
        }
    });
}

const removeSession = () => {
    client.query('delete from wa_session', (err, result)=>{
        if (err){
            console.error('Failed to remove session', err);
        }else{
            console.log('Session removed!');
        }
    });
}

module.exports = {
    readSession,
    saveSession,
    removeSession
}