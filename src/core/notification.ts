import { NotificationCenter } from "node-notifier";
import * as os from "os";
import * as readline from "readline";

const notifier = new (NotificationCenter as any)();

export class Notification {

    public static question(text: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            switch (os.type()) {
                case "Darwin": {
                    // OSX
                    notifier.notify({
                        title: "webcrypto-local",
                        message: text,
                        wait: true,
                        actions: "Yes",
                        closeLabel: "No",
                        // timeout: 30,
                    } as any, (error: Error, response: string) => {
                        if (response === "activate") {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                    break;
                }
                default: {
                    // Windows, Linux
                    // resolve(true);
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
                }
            }
        });
    }

    public static prompt(text: string): Promise<string> {
        return new Promise((resolve, reject) => {
            switch (os.type()) {
                case "Darwin": {
                    // OSX
                    notifier.notify({
                        title: "webcrypto-local",
                        message: `Enter PIN for PKCS#11 token`,
                        wait: true,
                        // actions: "Yes",
                        // closeLabel: "No",
                        timeout: -1,
                        reply: true,
                        // timeout: 30,
                    } as any, (err: Error, response: string, metadata: { activationValue: string }) => {
                        try {
                            if (response !== "replied") {
                                reject(new Error("CryptoLogin timeout"));
                            } else {
                                resolve(metadata.activationValue);
                            }
                        } catch (err) {
                            reject(err);
                        }
                    });
                    break;
                }
                default: {
                    // Windows, Linux
                    // resolve("");
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    });

                    rl.question(text, (answer) => {
                        rl.close();
                        resolve(answer);
                    });
                }
            }
        });
    }

}
