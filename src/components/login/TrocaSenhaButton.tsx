"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export default function TrocaSenhaButton() {
  return (
    <Button className="mr-2">
      {" "}
      <Link href="trocar-senha"> Trocar senha</Link>{" "}
    </Button>
  );
}
