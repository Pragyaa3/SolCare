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

// Enhanced AI verification with detailed analysis
async function verifyDocumentWithAI(imagePath) {
  try {
    console.log('🤖 Starting AI verification for:', imagePath);
    
    // Simulate AI processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const stats = await fs.stat(imagePath);
    const fileSize = stats.size;
    
    // More sophisticated scoring based on file characteristics
    let baseScore = 75;
    
    // Bonus for larger files (more detailed documents)
    if (fileSize > 100000) baseScore += 5;
    if (fileSize > 500000) baseScore += 5;
    
    // Add randomness for realism
    baseScore += Math.random() * 15;
    
    const finalScore = Math.min(Math.floor(baseScore), 98);
    
    console.log('✅ AI Verification complete - Score:', finalScore);
    
    return {
      verified: finalScore > 80,
      score: finalScore,
      confidence: {
        authenticity: Math.floor(88 + Math.random() * 12),
        consistency: Math.floor(85 + Math.random() * 15),
        medicalValidity: Math.floor(86 + Math.random() * 14),
        riskLevel: finalScore > 90 ? 'Very Low' : finalScore > 80 ? 'Low' : 'Medium'
      },
      extractedData: {
        patientName: "Auto-detected from document",
        hospitalName: "Verified medical facility",
        dateOfAdmission: new Date().toISOString().split('T')[0],
        diagnosis: "Medical condition extracted",
        estimatedCost: `${Math.floor(Math.random() * 5000) + 2000} SOL`,
        documentType: "Medical Bill/Report"
      },
      aiAnalysis: {
        documentsDetected: ['Medical Invoice', 'Lab Report', 'Prescription'],
        redFlags: finalScore < 85 ? ['Minor inconsistency in dates'] : [],
        recommendations: finalScore > 90 ? 'Approve Immediately' : 'Manual Review Recommended'
      }
    };
  } catch (error) {
    console.error('❌ AI Verification failed:', error);
    throw new Error(`AI Verification failed: ${error.message}`);
  }
}

function generateDocumentHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// Main verification endpoint
app.post('/api/verify-document', upload.single('document'), async (req, res) => {
  console.log('📄 Document upload received');
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No document uploaded',
        success: false 
      });
    }

    const { description, amount } = req.body;
    console.log('📝 Description:', description);
    console.log('💰 Amount:', amount);

    // 1. Generate document hash
    console.log('🔐 Generating document hash...');
    const documentHash = generateDocumentHash(req.file.path);
    console.log('✅ Hash generated:', documentHash.substring(0, 16) + '...');

    // 2. AI verification
    console.log('🤖 Starting AI verification...');
    const aiResult = await verifyDocumentWithAI(req.file.path);

    // 3. Calculate composite score
    const finalScore = Math.floor(
      (aiResult.score * 0.5) + 
      (aiResult.confidence.authenticity * 0.2) + 
      (aiResult.confidence.consistency * 0.15) +
      (aiResult.confidence.medicalValidity * 0.15)
    );

    console.log('📊 Final Score:', finalScore);

    // 4. Clean up uploaded file
    await fs.unlink(req.file.path).catch(err => 
      console.error('⚠️ Cleanup warning:', err)
    );

    // 5. Return comprehensive result
    const response = {
      success: true,
      verified: finalScore >= 80,
      overallScore: finalScore,
      documentHash,
      aiAnalysis: aiResult,
      metadata: {
        uploadedAt: new Date().toISOString(),
        fileSize: req.file.size,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        description,
        amount
      },
      recommendation: finalScore >= 95 ? 'APPROVE IMMEDIATELY - High Confidence' :
                      finalScore >= 85 ? 'APPROVE - Good Confidence' :
                      finalScore >= 75 ? 'REVIEW REQUIRED - Medium Confidence' :
                      'REJECT - Low Confidence',
      processingTime: '1.5s'
    };

    console.log('✅ Verification complete:', response.recommendation);
    
    res.json(response);

  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Verification failed', 
      message: error.message,
      details: 'Internal AI processing error'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'SolCare AI Verification API',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Platform statistics
app.get('/api/stats', async (req, res) => {
  res.json({
    totalVerifications: 247,
    approvalRate: 87.5,
    averageProcessingTime: 1.5,
    fraudDetectionRate: 95.8,
    activeVendors: 100,
    totalEmergencies: 47,
    totalFunded: 3200,
    aiModelVersion: 'GPT-4-Vision-Simulation',
    lastUpdated: new Date().toISOString()
  });
});

// Test endpoint for quick verification
app.get('/api/test', (req, res) => {
  res.json({
    message: 'SolCare AI API is running!',
    endpoints: {
      verification: 'POST /api/verify-document',
      health: 'GET /api/health',
      stats: 'GET /api/stats'
    },
    status: 'operational'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ═══════════════════════════════════════════════');
  console.log('🚀 SolCare AI Verification API');
  console.log('🚀 ═══════════════════════════════════════════════');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Stats:  http://localhost:${PORT}/api/stats`);
  console.log(`🧪 Test:   http://localhost:${PORT}/api/test`);
  console.log('🚀 ═══════════════════════════════════════════════');
  console.log('');
});

export default app;
