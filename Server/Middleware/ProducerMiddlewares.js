const produce = (req, res)=>{
    res.status(200).json({message: "producer endpoint"});
}

module.exports = produce;