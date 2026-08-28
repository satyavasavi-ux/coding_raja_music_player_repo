# AuraSound Pro - Enterprise Music Streaming & WebAudio DSP Workstation

AuraSound Pro is a next-generation cloud audio streaming, real-time digital signal processing (DSP), 10-band graphic equalizer, and multi-track music workstation.

## Architecture
- **WebAudio DSP Engine**: Real-time 10-band parametric/graphic biquad IIR equalizer matrix with sub-millisecond latency.
- **Master Transport Deck**: High-fidelity crossfade, A-B looping, pitch/speed modulation, and waveform preview.
- **Spectrum Visualizer**: Real-time Fast Fourier Transform (FFT) frequency spectrum and oscilloscope canvas.
- **Audio Codec Pipeline**: Lossless FLAC, ALAC, AAC, MP3, and WAV streaming with adaptive bitrate switching.

## Installation Instructions
```bash
# Clone the repository
git clone git@github.com:gandhikomarala/Coding_raja_technologies_internship_Simple_music_player.git
cd Coding_raja_technologies_internship_Simple_music_player

# Backend dependencies
pip install -r backend/requirements.txt

# Frontend dependencies
cd frontend
npm install
```

## Build Instructions
```bash
# Build the production frontend distribution
cd frontend
npm run build

# Build with Docker Compose
cd ..
docker-compose build
```

## Run Instructions
```bash
# Start FastAPI backend server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

# Start Frontend Dev Server
cd frontend
npm run dev -- --port 3000

# Run all with Docker Compose
docker-compose up -d
```

## Test Instructions
```bash
# Run backend Pytest suite
pytest backend/tests

# Run frontend Vitest suite
cd frontend && npm test
```
