const appKey = '' // Agregar appKey
const appToken = '' // Agregar appToken

// GET
export const getDocument = async () => {
    try {
        const response = await fetch('/api/dataentities/CF/search?_fields=CookieFortune,id', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.vtex.ds.v10+json",
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            },
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log('Error fetch data', error)
        return error
    }
}

// POST
export const createNewMessage = async (
    newMessage: string,
    setNewMessage: (value: string) => void,
    refresh: () => void,
    showStatus: (msg: string) => void
) => {
    try {
        const response = await fetch(`/api/dataentities/CF/documents/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.vtex.ds.v10+json',
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            },
            body: JSON.stringify({
                CookieFortune: newMessage,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.log('Error al guardar', response.status, errorData)
            showStatus('Hubo un error al agregar el mensaje')
            return
        }

        const result = await response.json()
        console.log('Mensaje guardado', result)

        showStatus('Mensaje agregado con éxito')
        setNewMessage('')
        refresh()
    } catch (error) {
        console.log('Error', error)
    }
}

// DELETE
export const handleDelete = async (
    id: string,
    refresh: () => void,
    showStatus: (msg: string) => void
) => {
    if (!id) return

    const confirmDelete = window.confirm('Eliminar este mensaje?')
    if (!confirmDelete) return

    try {
        const response = await fetch(`/api/dataentities/CF/documents/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.vtex.ds.v10+json',
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            },
        })

        if (!response.ok) {
            console.log('Error', response.status)
            showStatus('Error al eliminar el mensaje')
            return
        }

        showStatus('Mensaje eliminado con éxito')
        refresh()
    } catch (error) {
        console.log('Error al eliminar', error)
        showStatus('Error al eliminar el mensaje')
    }
}
