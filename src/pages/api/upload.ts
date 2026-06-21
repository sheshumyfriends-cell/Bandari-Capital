import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../lib/cloudinary';
import formidable from 'formidable';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error' });
    const file = (files.file as any);
    try {
      const result = await cloudinary.uploader.upload(file.filepath || file.path, { resource_type: 'auto' });
      return res.status(200).json({ url: result.secure_url });
    } catch (e) {
      return res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  });
}
