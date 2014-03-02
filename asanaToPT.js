var config = require("config"),
	asana = require('asana-api'),
	Q = require("q");

var asanaKey = config.asanaKey;
asana.setApiKey(asanaKey);
console.log("Asana Key: " + (asanaKey ? "<found>" : "<not found>"));

var ptKey = config.ptKey;
console.log("Pivotal Tracker Key: " + (ptKey ? "<found>" : "<not found>"));

var promises = [];
for (var i = 0; i < 5; i++) {
	var d = Q.defer(),
		c = i;
	promises.push(d);
	
		
	setTimeout(function() { console.log(c); d.resolve(c); }, i*200);
}

Q.all(promises).then(function(r) { console.log("done! " + JSON.stringify(r)); });

function log(s) {
	console.log("> " + s);
}

function getProjects() {
	var d = Q.defer();
	asana.getProjects(null, function(e, r) {
		d.resolve(r.data);
	});
		
	return d.promise;
}

function printProjects(projects) {
	console.log("\nProjects:");
	
	for(var p in projects) {
		console.log("  " + projects[p].id + " - " + projects[p].name);
	}
	
	return projects;
}

function getAllTasksFromAllProjects(projects) {
	var p = [];
	
	// Pushing all the getTasks promises to p for each project
	for(var i in projects) {
		p.push(getTasksForProject(projects[i].id, projects[i].name));
		break;
	}
	
	return Q.all(p);
}

var count = 0
count2=0;
function getTasksForProject(projectId, projectName) {
	var d = Q.defer();
	
	log("Getting tasks for project[" + count++ + "]: " + projectName);
	asana.getTasksProject(projectId, null, function(e, r) {
		log(">>>>>>>[" + count2++ + "]" + projectName + " " + e);
		
		if (r == null) {
			d.resolve(null);
			log("No tasks for project:" + projectName);
			return;
		}
		
		log("Getting tasks for " + projectName + " [" + r.data.length);
	
		var a = getTaskDetails(r.data);
		log("a = " + JSON.stringify(a));
		
		a.then(function(tasks) {
			log("getTaskDetails " + JSON.stringify(tasks));
			d.resolve({
				projectName: projectName,
				projectId: projectId,
				tasks: tasks
			});
		}, function(e) { log("########" + e);});
	});
		
	return d.promise;
}

function getTaskDetails(tasks) {
	var p = [];
	
	var max = 3;
	for (var i in tasks) {
		if (max-- <= 0) break;
		
		(function(){
			var d = Q.defer();
			p.push(d.promise);
		
			log("getTaskDetails for: " + JSON.stringify(tasks[i]));
		
			asana.getTask(tasks[i].id, null, function(e, r) {
				d.resolve(r.data);
				log("getTask data: " + JSON.stringify(r.data));
			});
		})();
	}
	
	log(p[0] == p[1]);
	
	return Q.all(p);
}

function printTasks(projects) {
	console.log("/nProjects: ");
	
	for(var i in projects) {
		var p = projects[i];
		
		console.log(" - " + p.projectName + " (" + p.projectId + ")");
		
		for(var i in p.tasks) {
			var t = tasks[i];
		
			console.log("    - " + JSON.stringify(t));
		}
	}
	
	return tasks;
}

var tasks = Q.fcall(getProjects)
 .then(printProjects)
 .then(getAllTasksFromAllProjects)
 .then(printTasks)
 .fail(function(r){log("*******  ******** " + r);})
 .done();
 
 
 
 
 