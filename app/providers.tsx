
"use client";

import { Provider } from "react-redux";
import { useState } from "react";

import { makeStore } from "../lib/store";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() => makeStore());

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
