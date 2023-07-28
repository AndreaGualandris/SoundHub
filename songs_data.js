const metadata = require('./metadata')

//refreshData()  -- enable if there isn't db 
module.exports.refreshData = refreshData;

function refreshData() {
    console.log("[+] Imported data.json")
    metadata.all()
        .then((data)=>
        {
            module.exports.songs = data
        }
        )
}

