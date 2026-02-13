import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";

export function HomePage() {
  return (
    <main>
      <section>
        <h1>RollerScape</h1>
        <h2>Secondary title</h2>
        <h3>Article or section title</h3>
        <h4>I am so special...</h4>
        <p>Je suis un protozoaire</p>
        <form className="py-1 flex flex-col gap-0.5 w-fit">
          <Input type="text" label="Comment tu t'appelles?" required />
          <Button>Submit me</Button>
          <Button type="button" color="secondary">Click me instead</Button>
        </form>
      </section>
    </main>
  )
}
