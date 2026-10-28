import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestForm from '../components/RequestForm.jsx';
import { addRequest } from '../services/requestService.js';

function NewRequestPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  async function handleAddRequest(input) {
    setErrorMessage('');

    try {
      const created = await addRequest(input);
      navigate(`/requests/${created.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'ไม่สามารถสร้างคำร้องได้'
      );
    }
  }

  return (
    <section data-testid="page-new-request">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">CONTROLLED FORM</p>
          <h1>สร้างคำร้องใหม่</h1>
          <p>
            ตรวจข้อมูลก่อนบันทึก ทุกคำร้องใหม่เริ่มต้นที่ pending
          </p>
        </div>
      </div>

      {errorMessage && (
        <section className="state-card">
          <p>{errorMessage}</p>
        </section>
      )}

      <section className="panel form-panel">
        <RequestForm onAddRequest={handleAddRequest} />
      </section>
    </section>
  );
}

export default NewRequestPage;