let RECENT_RESULT = {};

// 		+---------------------+
// 		|    World Wide Web   |
// 		|       Library       |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid

class WWW {
	static redirect(url, fn) {
		if (fn) {
			fn();
		}
		window.location.href = url;
	}
	static reload(url) {
		location.reload();
	}
	static randomString(len) {
		let result = "";
		let possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		for (let i = 0; i < len; i++) {
			let rndIndex = Math.floor(Math.random() * possible.length);
			result += possible[rndIndex];
		}
		return result;
	}
	static uniqueID(len_ = new Date().valueOf().toString().length) {
		let len = (len_ > new Date().valueOf().toString().length) ? new Date().valueOf().toString().length : len_;
		let d = new Date().valueOf().toString();
		let i = d.length - len;
		d = d.substring(i);
		return d;
	}
	static cls() {
		let curr = window.location.href;
		curr = curr.split("?")[0];
		window.location.href = curr;
	}
	static objectToQuery(obj) {
		let entries = Object.entries(obj);
		let query = "?";
		for (let i = 0; i < entries.length; i++) {
			query += entries[i][0] + "=" + entries[i][1];
			query += (i == entries.length - 1) ? "" : "&";
		}
		return query;
	}
	static reloadWithInputs(obj) {
		let query = WWW.objectToQuery(obj);
		let a = window.location.toString() + query;
		window.location.href = a;
	}
	static getUrlVariables() {
		let query = window.location.search.substring(1);
		let vars = query.split('&');
		let result = {}, pair;
		for (let i = 0; i < vars.length; i++) {
			pair = vars[i].split('=');
			result[pair[0]] = pair[1];
		}
		return result;
	}
	static hasUrlVariables() {
		return JSON.stringify(WWW.getUrlVariables()) !== "{}";
	}
	static readCookie() {
		let cookieArr = document.cookie.split(';');
		let cookie = {};
		for (var i = 0; i < cookieArr.length; i++) {
			let gimmeCookie = cookieArr[i].trim();
			gimmeCookie = gimmeCookie.split('=');
			cookie[gimmeCookie[0]] = gimmeCookie[1];
		}
		return cookie;
	}
	static writeCookie(obj) {
		var entries = Object.entries(obj);
		var cookie = '';
		for (var i = 0; i < entries.length - 1; i++) {
			var gimmeString =  entries[i][0] + '=' + entries[i][1] + ';';
			cookie += gimmeString;
		}
		document.cookie = cookie;
	}
	static copyObject(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	static waitTillRecentUpdate(fn) {
		return new Promise((resolve, reject) => {
			let prev = JSON.stringify(RECENT_RESULT), next;
			for (let i = 0; i < 1e7; i++) {
				next = JSON.stringify(RECENT_RESULT);
				if (next === prev) {
					fn();
					resolve(RECENT_RESULT);
				}
			}
		});
	}
	static sleep(millis) {
		let start = new Date().getTime();
		for (let i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > millis) {
				break;
			}
		}
	}
	static wait(millis, callback) {
		setTimeout(callback, millis);
	}
	static allowEditability() {
		document.body.contentEditable = true;
	}
	static p5Exists() {
		try {
			if (p5) {return true;} else {return false;}
		} catch(err) {
				return false;
		}
	}
	static RiTaExists() {
		try {
			if (RiTa) {return true;} else {return false;}
		} catch(err) {
				return false;
		}
	}
}

// 		+---------------------+
// 		|      Database       |
// 		|        Class        |
// 		+---------------------+
//               |
//                \_ by EthanThatOneKid
//                 \_ for firebase databases

class Database {
	constructor(id = WWW.randomString(10)) {
		this.test_element_id = id;
		this.recentResult = RECENT_RESULT;
		let elt = document.createElement("div");
		elt.id = this.test_element_id;
		elt.style.display = "none";
		try {
			document.getElementsByTagName("body")[0].appendChild(elt);
		} catch (err) {
			console.log("Cannot place elt there; " + err);
		}
	}
	updateRecentResult() {
		this.recentResult = RECENT_RESULT;
	}
	set(path, obj) {
		return firebase.database().ref(path).set(obj);
	}
	getFirebaseData(path, fn = {}) {
		let id = this.test_element_id;
		return Database.getFirebaseData(path, id, fn).then(function() {
			let str = document.getElementById(id).innerHTML;
			try {
				RECENT_RESULT = JSON.parse(str);
			} catch(err) {
				console.error("Firebase Data !> RECENT_RESULT");
			}
		});
	}
	getMultipleFirebaseDatas(paths) {
		let result = [];
		return new Promise((resolve, reject) => {
			for (let i = 0; i < paths.length; i++) {
				this.getFirebaseData(paths[i], {
					"exists": function(x) {
						result.push(x);
					},
					"absent": function() {
						result.push(undefined);
					}
				}).then(function() {
					if (result.length >= paths.length) {
						resolve(result);
					}
				});
			}
		});
	}
	static getFirebaseData(path, id, fn) {
		return firebase.database().ref(path).once("value").then(function(data) {
			if (!data.exists()) {
				console.log("Data does not exist for this directory.");
				if (fn.absent) {fn.absent();}
				return;
			}
			let result = JSON.stringify(data.val());
			document.getElementById(id).innerHTML = result;
			if (fn.exists) {fn.exists(data.val());}
			console.log("Firebase data => RECENT_RESULT");
		});
	}
}
