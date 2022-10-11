import { useEffect, useState } from "react";
import axios from "axios";

const TransactionList = () => {
  const [allTxn, setAllTxn] = useState([]);

  const [formData, setFormData] = useState({
    type: "Credit",
    amount: "",
    desc: "",
    runningBalance: 0,
  });

  async function getAllTxn() {
    const { data } = await axios.get("http://localhost:5000/getAllTxn");
    setAllTxn(data);
  }

  useEffect(() => {
    getAllTxn();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let prevRunningBalance = allTxn[0]?.runningBalance || 0;
    let currentRunningBalance = 0;

    if (formData.type === "Credit") {
      currentRunningBalance =
        parseInt(prevRunningBalance) + parseInt(formData.amount);
    } else {
      currentRunningBalance =
        parseInt(prevRunningBalance) - parseInt(formData.amount);
    }

    try {
      await axios.post("http://localhost:5000/addTxn", {
        ...formData,
        runningBalance: currentRunningBalance,
      });
      getAllTxn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* form modal for add transaction */}
      <div
        class="modal fade"
        id="txnAddModal"
        tabindex="-1"
        aria-labelledby="txnAddModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="txnAddModalLabel">
                New Transaction
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="type" class="form-label">
                    Type
                  </label>
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                  >
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="amount" class="form-label">
                    Amount
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="desc" class="form-label">
                    Description
                  </label>
                  <textarea
                    class="form-control"
                    id="desc"
                    rows="3"
                    value={formData.desc}
                    onChange={(e) =>
                      setFormData({ ...formData, desc: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="submit"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Make transaction
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Office Transactions</h2>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#txnAddModal"
        >
          Add Transaction
        </button>
      </div>

      {/* tabel for list of all txn in desending order by creation date */}
      <table class="table table-bordered mt-5 table-responsive">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Desccription</th>
            <th scope="col">Credit</th>
            <th scope="col">Debit</th>
            <th scope="col">Running Balance</th>
          </tr>
        </thead>
        <tbody>
          {allTxn?.map((txn) => (
            <tr>
              <th scope="row">{new Date(txn.createdAt).toDateString()}</th>
              <td>{txn.desc}</td>
              <td>{txn.type === "Credit" && txn.amount}</td>
              <td>{txn.type === "Debit" && txn.amount}</td>
              <td>{txn.runningBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TransactionList;
