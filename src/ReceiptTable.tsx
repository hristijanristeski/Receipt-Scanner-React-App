import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface Product {
  name: string;
  domestic: boolean;
  weight?: number;
  price: number;
  description: string;
}

async function getReceipt(): Promise<Product[]> {
  try {
    const { data } = await axios.get(
      "https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      throw error.message;
    } else {
      console.log("unexpected error: ", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

const ReceiptTable: React.FC = () => {
  const [receiptData, setReceiptData] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getReceipt();
      const sortedData = data.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      });
      setReceiptData(sortedData);
    }
    fetchData();
  }, []);

  const domesticProducts = receiptData.filter((product) => product.domestic);
  const importedProducts = receiptData.filter((product) => !product.domestic);

  const printTableRow = (product: Product) => {
    let truncatedDescription = product.description;
    if (truncatedDescription.length > 100) {
      truncatedDescription = truncatedDescription.slice(0, 100) + "...";
    }

    return (
      <tr key={product.name}>
        <td>{product.name}</td>
        <td>{`$${product.price.toFixed(1)}`}</td>
        <td>{product.description}</td>
        <td>{product.weight ? `${product.weight}g` : "N/A"}</td>
      </tr>
    );
  };

  return (
    <div>
      <h2 className="title">Domestic</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {domesticProducts.map((product) => printTableRow(product))}
        </tbody>
      </table>

      <h2 className="title">Imported</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {importedProducts.map((product) => printTableRow(product))}
        </tbody>
      </table>

      <div className="totalCost">
        <h2>Total Cost</h2>
        <p>
          Domestic Cost:{" "}
          {`$${domesticProducts
            .reduce((sum, product) => sum + product.price, 0)
            .toFixed(1)}`}
        </p>
        <p>
          Impored Cost:{" "}
          {`$${importedProducts
            .reduce((sum, product) => sum + product.price, 0)
            .toFixed(1)}`}
        </p>
      </div>
      <div className="productsCount">
        <h2>Purchased Products Count</h2>
        <p>
          Domestic count:{" "}
          {receiptData.filter((product) => product.domestic).length}
        </p>
        <p>
          Imported count:{" "}
          {receiptData.filter((product) => !product.domestic).length}
        </p>
      </div>
    </div>
  );
};

export default ReceiptTable;
