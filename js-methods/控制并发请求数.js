
function timeout(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
class SuperTask {
    constructor(parallelCount = 2) {
        this.parallelCount = parallelCount
        this.tasks = []
        this.runningCount = 0
    }
    add(task) {
        return new Promise((resolve, reject) => {
            this.tasks.push({
                task,
                resolve,
                reject
            })
            this._run()
        })
    }

    _run() {
        while (this.runningCount < this.parallelCount && this.tasks.length) {
            const { task, reject, resolve } = this.tasks.shift()
            this.runningCount++
            task().then(resolve, reject).finally(() => {
                this.runningCount--
                this._run()
            })
        }
    }
}

const superTask = new SuperTask()
function addTask(time, name) {
    superTask.add(() => timeout(time)).then(() => {
        console.log(`任务${name}完成了!`);
    })
}

addTask(1000, 1)
addTask(1000, 2)
addTask(1000, 3)
addTask(1000, 4)
addTask(1000, 5)
addTask(1000, 6)