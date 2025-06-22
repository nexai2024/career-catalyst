import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import { prisma } from "@/lib/db";
export async function POST(req: NextRequest) {
    try {
        const prismaClient = prisma;
        const evt = await verifyWebhook(req)

        // Do something with payload
        // For this guide, log payload to console
        if ('first_name' in evt.data && 'last_name' in evt.data && 'image_url' in evt.data && 'email_addresses' in evt.data) {
            const { id, first_name, last_name, image_url, email_addresses } = evt.data;
            const eventType = evt.type
            console.log(`Received webhook with ID ${id} and event type of ${eventType}`)

            const response = await prismaClient.user.create({
                data: {
                    id,
                    authid: id,
                    name: first_name + ' ' + last_name,
                    image: image_url,
                    email: email_addresses[0]?.email_address || '',
                },
            })
            console.log('User created:', response)
            return new Response('Webhook received', { status: 200 })
        } else {
            console.error('Unexpected webhook data format:', evt.data);
            return new Response('Unexpected webhook data format', { status: 400 });
        }
    }
    catch (err) {
            console.error('Error verifying webhook:', err);
            return new Response('Error verifying webhook', { status: 400 })
        }
    }