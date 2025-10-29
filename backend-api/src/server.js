import express from 'express';
import multer from 'multer';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Mock AI verification
async function verifyDocumentWithAI(imagePath) {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const stats = await fs.stat(imagePath);
    const baseScore = 75 + Math.random() * 20;
    
    return {
      verified: baseScore > 80,
      score: Math.floor(baseScore),
      confidence: {
        authenticity: Math.floor(90 + Math.random() * 10),
        consistency: Math.floor(85 + Math.random() * 15),
        medicalValidity: Math.floor(88 + Math.random() * 12),
        riskLevel: baseScore > 85 ? 'Low' : 'Medium'
      },
      extractedData: {
        patientName: "Extracted from document",
        hospitalName: "Extracted hospital name",
        dateOfAdmission: new Date().toISOString().split('T')[0],
        diagnosis: "Extracted diagnosis",
        estimatedCost: "Extracted cost"
      }
    };
  } catch (error) {
    throw new Error(`AI Verification failed: ${error.message}`);
  }
}

function generateDocumentHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

app.post('/api/verify-document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }

    const { description, amount } = req.body;

    const documentHash = generateDocumentHash(req.file.path);
    const aiResult = await verifyDocumentWithAI(req.file.path);

    const finalScore = Math.floor(
      (aiResult.score * 0.6) + 
      (aiResult.confidence.authenticity * 0.2) + 
      (aiResult.confidence.consistency * 0.2)
    );

    await fs.unlink(req.file.path).catch(err => console.error('Cleanup error:', err));

    res.json({
      success: true,
      verified: finalScore >= 80,
      overallScore: finalScore,
      documentHash,
      aiAnalysis: aiResult,
      metadata: {
        uploadedAt: new Date().toISOString(),
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        description,
        amount
      },
      recommendation: finalScore >= 90 ? 'Approve Immediately' :
                      finalScore >= 80 ? 'Approve with Review' :
                      finalScore >= 70 ? 'Manual Review Required' :
                      'Reject - High Risk'
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: 'Verification failed', 
      message: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', async (req, res) => {
  res.json({
    totalVerifications: 247,
    approvalRate: 87.5,
    averageProcessingTime: 3.2,
    fraudDetectionRate: 95.8,
    activeVendors: 100,
    totalFunded: 3200
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 SolCare AI Verification API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats`);
});
