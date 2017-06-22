import * as readline from "readline";

export class Notification {

    public static question(text: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            rl.question(text, (answer) => {
                rl.close();
                if (answer && answer.length && answer[0].toLowerCase() === "y") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    public static prompt(text: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            rl.question(text, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

}
