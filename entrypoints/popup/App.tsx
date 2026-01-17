import { useState } from 'react';
import { Button } from '@/components/ui/button';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-[300px] min-w-[300px] p-6 flex flex-col items-center justify-center gap-4">
      <div className="flex gap-4">
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="h-16 w-16" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-16 w-16" alt="React logo" />
        </a>
      </div>
      <h1 className="text-2xl font-bold">WXT + React + shadcn/ui</h1>
      <div className="flex gap-2">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
      <p className="text-muted-foreground text-sm">
        shadcn/ui 已成功配置
      </p>
    </div>
  );
}

export default App;
