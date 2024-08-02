import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";


export async function checkTransaction(transactionClient: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$transaction" | "$disconnect" | "$connect" | "$on" | "$use" | "$extends">) {
    
    const select = await new PrismaClient().user.findFirst({});
    const user = await transactionClient.user.create({
        data: {
            email: 'alice@prisma.io',
            name: 'Alice',
        },
    });

    const post = await transactionClient.post.create({
        data: {
            title: 'Hello World',
            userId: user.id,
        },
    });

    await transactionClient.$executeRaw`INSERT INTO "Post" ("title", "userId") VALUES ('Another Post', ${user.id})`;

    // Simulating an error
    if (true) {
        throw new Error('Simulated error to trigger rollback');
    }

}