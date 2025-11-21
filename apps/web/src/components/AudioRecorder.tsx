import { useState, useRef } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Mic24Regular,
  Stop24Regular,
  Play24Regular,
  Pause24Regular,
  Delete24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '500px',
    width: '90vw',
  },
  recorderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px',
    gap: '24px',
  },
  recordButton: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  recording: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    animation: 'pulse 1.5s infinite',
  },
  timer: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    fontFamily: 'monospace',
  },
  waveform: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '60px',
  },
  waveBar: {
    width: '4px',
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusSmall,
    transition: 'height 0.1s',
  },
  controls: {
    display: 'flex',
    gap: '12px',
  },
  audioPlayer: {
    width: '100%',
    marginTop: '16px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
  },
});

interface AudioRecorderProps {
  open: boolean;
  onClose: () => void;
  onSave?: (audioBlob: Blob) => void;
}

export function AudioRecorder({ open, onClose, onSave }: AudioRecorderProps) {
  const styles = useStyles();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const handleSave = () => {
    if (audioChunksRef.current.length > 0 && onSave) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      onSave(audioBlob);
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateWaveform = () => {
    const bars = 20;
    return Array.from({ length: bars }, (_, i) => {
      const height = isRecording && !isPaused
        ? Math.random() * 40 + 20
        : 20;
      return (
        <div
          key={i}
          className={styles.waveBar}
          style={{ height: `${height}px` }}
        />
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Record Audio</DialogTitle>

          <div className={styles.recorderContainer}>
            <div className={styles.timer}>{formatTime(recordingTime)}</div>

            <div className={styles.waveform}>
              {generateWaveform()}
            </div>

            {!isRecording && !audioUrl && (
              <Button
                appearance="primary"
                size="large"
                icon={<Mic24Regular style={{ fontSize: '32px' }} />}
                onClick={startRecording}
                style={{ width: '80px', height: '80px', borderRadius: '50%' }}
              >
              </Button>
            )}

            {isRecording && (
              <div className={styles.controls}>
                <Button
                  appearance="secondary"
                  icon={isPaused ? <Play24Regular /> : <Pause24Regular />}
                  onClick={pauseRecording}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  appearance="primary"
                  icon={<Stop24Regular />}
                  onClick={stopRecording}
                >
                  Stop
                </Button>
              </div>
            )}

            {audioUrl && !isRecording && (
              <>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  className={styles.audioPlayer}
                />
                <div className={styles.controls}>
                  <Button
                    appearance="secondary"
                    icon={<Delete24Regular />}
                    onClick={deleteRecording}
                  >
                    Delete
                  </Button>
                  <Button
                    appearance="primary"
                    icon={<Mic24Regular />}
                    onClick={startRecording}
                  >
                    Record Again
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={handleSave}
              disabled={!audioUrl}
            >
              Insert Audio
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
