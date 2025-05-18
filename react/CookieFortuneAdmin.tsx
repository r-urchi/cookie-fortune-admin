import React, { FC, useState, useEffect } from 'react'
import {
  Layout,
  PageBlock,
  PageHeader,
  Table,
  Spinner,
  ButtonWithIcon,
  IconDelete,
  Input,
  Button,
} from 'vtex.styleguide'
import { createNewMessage, handleDelete, getDocument } from './utils/actions'
import './styles.global.css'

interface Item {
  CookieFortune: string
  id: string
}

const CookieFortuneAdmin: FC = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const loadItems = async () => {
    try {
      const data = await getDocument()

      if (Array.isArray(data)) {
        const parsedItems = data?.map((doc: Item) => ({
          CookieFortune: doc?.CookieFortune,
          actions: doc?.id,
        }))
        setItems(parsedItems)
      } else {
        setError(true)
      }
    } catch (error) {
      console.log('Error al obtener datos', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const showStatus = (message: string) => {
    setStatusMessage(message)
    setTimeout(() => setStatusMessage(''), 3000)
  }

  const jsonschema = {
    properties: {
      CookieFortune: {
        title: 'Mensaje de la Fortuna',
        width: 600,
      },
      actions: {
        title: 'Eliminar',
        width: 100,
        cellRenderer: ({ cellData }: { cellData: string }) => (
          <div className="mr2">
            <ButtonWithIcon
              icon={<IconDelete />}
              variation="danger"
              onClick={() => handleDelete(cellData, loadItems, showStatus)}
            />
          </div>
        ),
      },
    },
  }

  if (loading) {
    return (
      <div className="pa7">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <div className="pa7 red">Error al cargar los datos</div>
  }

  return (
    <Layout
      pageHeader={<PageHeader title="Cookie Fortune" />}
    >
      <PageBlock variation="full">
        <div style={{ position: 'relative' }}>
          <h4 className="t-heading-4 mt0"> Agregar nueva frase</h4>

          <div className="mb5">
            <Input
              label="Frase"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            />
          </div>

          <Button
            variation="primary"
            onClick={() => createNewMessage(newMessage, setNewMessage, loadItems, showStatus)}
            disabled={newMessage?.trim() === ''}
          >
            Agregar
          </Button>

          {statusMessage && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: '#666666',
              color: '#fff',
              padding: '8px',
              borderRadius: '4px'
            }}>
              {statusMessage}
            </div>
          )}
        </div>

      </PageBlock>

      <PageBlock variation="full">
        <Table
          schema={jsonschema}
          items={items}
          density="low"
        />
      </PageBlock>
    </Layout>
  )
}

export default CookieFortuneAdmin
