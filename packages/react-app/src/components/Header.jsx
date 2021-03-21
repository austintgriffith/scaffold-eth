import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title="🤝 Good Tokens"
        subTitle="not bad tokens"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
