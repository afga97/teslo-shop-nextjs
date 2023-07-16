import { URLSearchParams } from 'url'

export const buildResponseObject = (stocks: any[], page: number, size: number, criteria: object) => {
    const query = new URLSearchParams()

    query.set('size', size.toString())
    query.set('page', (page + 1).toString())

    Object.entries(criteria).forEach(([key, value]) => {
        query.set(key, value)
    })

    const base = {
        count: stocks.length,
        content: stocks
    }

    if (stocks.length >= size && page) Reflect.set(base, 'next', `/stocks?${query.toString()}`)

    if (page > 1) {
        query.set('page', (page - 1).toString())
        Reflect.set(base, 'previous', `/stocks?${query.toString()}`)
    }

    return base
}