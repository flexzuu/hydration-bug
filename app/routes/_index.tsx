import { defer } from "@remix-run/node";
import { useLoaderData, Await } from "@remix-run/react";
import { useState, Suspense } from "react";

export async function loader() {
    return defer({
      deferredResponse: new Promise((resolve) => setTimeout(resolve, 5000)).then(
        () => "hey from slow thing"
      ),
    });
  }
  
  export default function App() {
    const { deferredResponse } = useLoaderData<typeof loader>();
  
    return (
      <div>
        <pre>"hey from instant thing"</pre>
        <AwaitedItem deferredResponse={deferredResponse} />
      </div>
    );
  }
  
  function AwaitedItem({
    deferredResponse,
  }: {
    deferredResponse: Promise<string>;
  }) {
    const [showAwaitedItem, setShowAwaitedItem] = useState(false);
  
    return (
      <div className="AwaitedItem">
        <button
          onClick={() =>
            setShowAwaitedItem((prevShowAwaitedItem) => !prevShowAwaitedItem)
          }
        >
          {showAwaitedItem ? "hide" : "show"}
        </button>
        <div style={{ visibility: showAwaitedItem ? "visible" : "hidden" }}>
          <Suspense fallback="loading slow thing...">
            <Await resolve={deferredResponse}>
              {(data) => <pre>{JSON.stringify(data)}</pre>}
            </Await>
          </Suspense>
        </div>
      </div>
    );
  }