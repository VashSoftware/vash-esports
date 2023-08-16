import { z } from 'zod'

import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

const schema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const load = async () => {
    const form = await superValidate(schema)

    return { form }
}

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, schema)
        console.log('POST', form)

        if (!form.valid) {
            return fail(400, { form })
        }

        return { form }
    }
}