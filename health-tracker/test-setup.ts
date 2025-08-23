import { prisma } from '@health-tracker/db'
import { DailyMetricSchema } from '@health-tracker/types'

async function testSetup() {
    // Test database connection
    const userCount = await prisma.user.count()
    console.log('Users in database:', userCount)

    // Test Zod validation
    const validMetric = DailyMetricSchema.parse({
        date: '2024-01-15',
        weight: 70.5,
        restingHR: 65
    })
    console.log('Valid metric:', validMetric)

    // Test invalid data (this should throw an error)
    try {
        DailyMetricSchema.parse({
            date: 'invalid-date',
            weight: -10,
        })
    } catch (error) {
        console.log('Validation caught invalid data ✅')
    }
}

testSetup()