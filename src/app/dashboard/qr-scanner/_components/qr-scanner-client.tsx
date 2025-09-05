'use client';

import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  CheckCircle,
  ChevronRight,
  Loader2,
  Package,
  ScanLine,
  Ship,
  Store,
  Tractor,
  Truck,
  Warehouse,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data for product journey
const journeyData = {
  'PROD-001': {
    product: { name: 'Organic Tomatoes', image: 'https://picsum.photos/id/1080/100/100', dataAiHint: 'tomatoes produce' },
    steps: [
      {
        icon: Tractor,
        title: 'Harvested',
        location: 'Green Valley Farms',
        date: '2023-10-20',
        status: 'Completed',
      },
      {
        icon: Warehouse,
        title: 'Packed at Warehouse A',
        location: 'Fresno, CA',
        date: '2023-10-21',
        status: 'Completed',
      },
      {
        icon: Truck,
        title: 'In Transit',
        location: 'Headed to Distribution Center',
        date: '2023-10-22',
        status: 'Completed',
      },
      {
        icon: Ship,
        title: 'Distribution Center',
        location: 'Los Angeles, CA',
        date: '2023-10-23',
        status: 'Completed',
      },
      {
        icon: Store,
        title: 'Delivered to Retailer',
        location: 'Local Grocer, LA',
        date: '2023-10-24',
        status: 'Current',
      },
    ],
  },
};

type JourneyStep = {
  icon: React.ElementType;
  title: string;
  location: string;
  date: string;
  status: 'Completed' | 'Current' | 'Pending';
};

export function QrScannerClient() {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productJourney, setProductJourney] = useState<{product: {name: string, image: string, dataAiHint: string}, steps: JourneyStep[]} | null>(null);
  const [manualProductId, setManualProductId] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  const fetchProductJourney = (productId: string) => {
    setIsLoading(true);
    setProductJourney(null);
    console.log(`Fetching journey for ${productId}`);
    // Simulate API call
    setTimeout(() => {
      const data = journeyData[productId as keyof typeof journeyData];
      if (data) {
        setProductJourney(data);
      } else {
        toast({
          title: 'Product Not Found',
          description: `No journey information found for product ID: ${productId}`,
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          setScannedData(code.data);
          fetchProductJourney(code.data);
          stopScan();
        }
      }
    }
    requestRef.current = requestAnimationFrame(tick);
  };

  const startScan = () => {
    setScannedData(null);
    setProductJourney(null);
    requestRef.current = requestAnimationFrame(tick);
  };

  const stopScan = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        startScan();
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
      stopScan();
       if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, []);
  
  const handleManualTrack = () => {
    if (manualProductId) {
      fetchProductJourney(manualProductId);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">QR Scanner & Product Journey</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>
              Use your device's camera to scan the QR code on the product, or enter the ID manually.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
              <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
              <canvas ref={canvasRef} className="hidden" />
              {!scannedData && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="h-1/2 w-1/2 animate-pulse text-primary/50" />
                </div>
              )}
             </div>

            {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <Camera className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use the QR scanner. You can still track by ID.
                  </AlertDescription>
                </Alert>
              )}
            
            <div className="flex w-full items-center space-x-2">
              <Input 
                type="text" 
                placeholder="Or enter Product ID manually" 
                value={manualProductId}
                onChange={(e) => setManualProductId(e.target.value)}
              />
              <Button onClick={handleManualTrack} disabled={isLoading}>
                Track
              </Button>
            </div>
            
            <Button onClick={startScan} variant="outline" className="w-full" disabled={!hasCameraPermission || (!!requestRef.current && !scannedData)}>
              {scannedData ? 'Scan another product' : 'Start Scanning'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Journey</CardTitle>
              <CardDescription>The verified journey from farm to you.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {productJourney && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                     <img src={productJourney.product.image} alt={productJourney.product.name} className="w-16 h-16 rounded-md object-cover" data-ai-hint={productJourney.product.dataAiHint} />
                     <div>
                      <h3 className="font-bold text-lg">{productJourney.product.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {scannedData}</p>
                     </div>
                  </div>
                  <div className="relative space-y-6 pl-6 before:absolute before:inset-y-0 before:left-8 before:w-0.5 before:bg-border">
                  {productJourney.steps.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${step.status === 'Completed' ? 'bg-primary' : 'bg-secondary'}`}>
                        <step.icon className={`h-5 w-5 ${step.status === 'Completed' ? 'text-primary-foreground' : 'text-secondary-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-semibold">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.location}</p>
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      </div>
                       {step.status === 'Current' && (
                          <div className="absolute top-1 -right-1 flex items-center gap-1 text-primary font-bold text-sm">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Current
                          </div>
                        )}
                    </div>
                  ))}
                  </div>
                </div>
              )}
              {!isLoading && !productJourney && (
                <div className="text-center text-muted-foreground py-10">
                  <p>Scan a QR code or enter a product ID to see its journey.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
