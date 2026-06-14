import { listings } from "./lib/listings";
import { RipeApp } from "./components/RipeApp";

export default function Home() {
  return <RipeApp listings={listings} />;
}
