import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import {
  getRequestById,
  updateRequestStatus,
} from '../services/requestService.js';

function RequestDetailPage() {
  const { requestId } = useParams();

  const [loadState, setLoadState] = useState('loading');
  const [request, setRequest] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, reload] = useManualReload();

  useEffect(() => {
    let ignore = false;

    setLoadState('loading');

    getRequestById(requestId)
      .then((result) => {
        if (ignore) return;

        setRequest(result);
        setLoadState('success');
      })
      .catch((error) => {
        if (ignore) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'โหลดรายละเอียดไม่สำเร็จ'
        );

        setLoadState('error');
      });

    return () => {
      ignore = true;
    };
  }, [requestId, reloadKey]);

  async function handleStatusChange(status) {
    try {
      await updateRequestStatus(request.id, status);
      reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'เปลี่ยนสถานะไม่สำเร็จ'
      );
    }
  }

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">T03 • ADVISOR APPOINTMENT</p>

          <h1>รายละเอียดการนัดหมาย</h1>

          <p>
            Appointment ID: <code>{requestId}</code>
          </p>
        </div>
      </div>

      {loadState === 'loading' && (
        <LoadingState message="กำลังโหลดรายละเอียด..." />
      )}

      {loadState === 'error' && (
        <ErrorState
          message={errorMessage}
          onRetry={reload}
        />
      )}

      {loadState === 'success' && !request && (
        <section className="state-card">
          <h2>ไม่พบข้อมูลการนัดหมาย</h2>

          <p>
            ไม่พบข้อมูลสำหรับ ID <code>{requestId}</code>
          </p>

          <Link to="/">
            กลับ Dashboard
          </Link>
        </section>
      )}

      {loadState === 'success' && request && (
        <article className="panel detail-card">
          <h2>{request.requestType}</h2>

          <dl>
            <div>
              <dt>ID</dt>
              <dd>{request.id}</dd>
            </div>

            <div>
              <dt>ผู้ขอนัดหมาย</dt>
              <dd>{request.requesterName}</dd>
            </div>

            <div>
              <dt>สถานที่นัดหมาย</dt>
              <dd>{request.location}</dd>
            </div>

            <div>
              <dt>รายละเอียดการนัดหมาย</dt>
              <dd>{request.details}</dd>
            </div>

            <div>
              <dt>ความเร่งด่วน</dt>
              <dd>{request.priority}</dd>
            </div>

            <div>
              <dt>สถานะ</dt>
              <dd>{request.status}</dd>
            </div>
          </dl>

          <div
  style={{
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    marginBottom: '16px',
  }}
>
  <button
    className="button primary"
    type="button"
    onClick={() =>
      handleStatusChange('in-progress')
    }
  >
    In Progress
  </button>

  <button
    className="button secondary"
    type="button"
    onClick={() =>
      handleStatusChange('completed')
    }
  >
    Complete
  </button>
</div>

          <Link to="/">
            กลับ Dashboard
          </Link>
        </article>
      )}
    </section>
  );
}

export default RequestDetailPage;