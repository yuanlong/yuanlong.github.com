if (/(iPhone|iPad|iPod|iOS|Mac)/i.test(navigator.userAgent)) {
var jsstoreCon = new JsStore.Connection(new Worker("js/jsstore.worker.min.js"));

async function initDb() {
    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
    if (isDbCreated) {
        console.log('db created');
    }
    else {
        console.log('db opened');
    }
}

function getDbSchema() {
    var table = {
        name: 'movies',
        columns: {
            id: {
                primaryKey: true
            },
            movieData: {
                notNull: true,
                dataType: 'string'
            },
            last_date: {
                dataType: 'number'
            }
        }
    }

    var db = {
        name: 'Movies',
        tables: [table]
    }
    return db;
}
    initDb();

window.saveMovie=async function (mov){
		var movie={id:mov.vod_id,movieData:JSON.stringify(mov),last_date:new Date().getTime()}
	    await jsstoreCon.insert({
            into: 'movies',
			upsert:true,
            values: [movie]
        });
}
window.deleteMovie=async function (){
	await jsstoreCon.remove({
            from: 'movies',
            where: {
                last_date: {
					"<":new Date().getTime()-60*24*60*60*1000
				}
            }
        });
}
window.queryMovie= async function (callback){
	var movies=[];
	var dbMovies = await jsstoreCon.select({
            from: 'movies'
        });
	dbMovies.forEach(function (mov) {
		movies.push(JSON.parse(mov.movieData));
	})
	var data={"data":movies};
	callback(data,true);
}
}