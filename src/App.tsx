import { Product } from "./pages/Product"

function App() {

  return (
    <>
      <header className="border-primary bg-secondary text-primary border-b-2 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Catálogo de productos
            </h1>
          </div>
        </div>
      </header>

      <main>
        <Product />
      </main>
    </>
  )
}

export default App
