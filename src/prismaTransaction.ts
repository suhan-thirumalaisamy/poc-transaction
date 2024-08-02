import { PrismaClient } from '@prisma/client';
import { checkTransaction } from './consumeDoc';

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$transaction(async (transactionClient) => {
            await checkTransaction(transactionClient);
            console.log('Logic is Done');
        },{ 
            timeout: 180000, 
            // isolationLevel : Prisma.TransactionIsolationLevel.ReadUncommitted 
        });
    } catch (error) {
        console.error('Transaction failed, rolled back', error);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
});
