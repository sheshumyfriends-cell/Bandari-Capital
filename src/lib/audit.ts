import AuditLog from '../models/AuditLog';

export async function createAudit({ user, action, collection, documentId, oldValue, newValue }: any) {
  try {
    await AuditLog.create({ user, action, collection, documentId, oldValue, newValue });
  } catch (e) {
    console.error('Audit log create failed', e?.message || e);
  }
}
