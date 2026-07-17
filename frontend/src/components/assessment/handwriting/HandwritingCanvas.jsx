// HandwritingCanvas.jsx
// Starter rewrite preserving public API.
// See chat for integration notes.

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

import { useAssessment } from "../utils/AssessmentContext";

const HandwritingCanvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const drawing = useRef(false);
    const activePointerId = useRef(null);

    const strokes = useRef([]);
    const currentStroke = useRef([]);

    const { setHandwritingData, setHandwritingImage } = useAssessment();

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;

        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        strokes.current.forEach((stroke) => {
            if (!stroke.length) return;

            ctx.beginPath();
            ctx.moveTo(stroke[0].x, stroke[0].y);

            for (let i = 1; i < stroke.length; i++) {
                ctx.lineTo(stroke[i].x, stroke[i].y);
            }

            ctx.stroke();
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;

            canvas.width = rect.width * ratio;
            canvas.height = rect.height * ratio;

            const ctx = canvas.getContext("2d");

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(ratio, ratio);

            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#1f2937";

            contextRef.current = ctx;

            redrawCanvas();
        };

        const observer = new ResizeObserver(resize);

        observer.observe(canvas);

        resize();

        return () => observer.disconnect();
    }, []);

    const makePoint = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            pressure: e.pressure > 0 ? e.pressure : 0.5,
            timestamp: Date.now(),
        };
    };

    const start = (e) => {
        if (e.pointerType === "touch") return;

        e.preventDefault();

        // Ignore if another pointer is still active
        if (
            activePointerId.current !== null &&
            activePointerId.current !== e.pointerId
        ) {
            return;
        }

        activePointerId.current = e.pointerId;
        drawing.current = true;

        currentStroke.current = [];

        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

        events.forEach((event) => {
            currentStroke.current.push(makePoint(event));
        });

        const firstPoint = currentStroke.current[0];

        if (!firstPoint) return;

        contextRef.current.beginPath();
        contextRef.current.moveTo(firstPoint.x, firstPoint.y);

        // Draw initial dot
        contextRef.current.beginPath();
        contextRef.current.arc(
            firstPoint.x,
            firstPoint.y,
            contextRef.current.lineWidth / 2,
            0,
            Math.PI * 2
        );

        contextRef.current.fillStyle = contextRef.current.strokeStyle;
        contextRef.current.fill();
    };

    const move = (e) => {
        if (!drawing.current) return;

        if (e.pointerId !== activePointerId.current) {
            return;
        }

        e.preventDefault();

        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

        events.forEach((event) => {
            const p = makePoint(event);

            currentStroke.current.push(p);

            contextRef.current.lineTo(p.x, p.y);
            contextRef.current.stroke();
        });
    };

    const end = (e) => {
        if (!drawing.current) return;

        if (e.pointerId !== activePointerId.current) {
            return;
        }

        // Copy the stroke first
        const finishedStroke = [...currentStroke.current];

        // Immediately reset drawing state
        drawing.current = false;
        activePointerId.current = null;
        currentStroke.current = [];

        // Ignore accidental taps
        if (finishedStroke.length < 2) {
            return;
        }

        strokes.current.push(finishedStroke);

        setHandwritingData([...strokes.current]);
    };

    useImperativeHandle(ref, () => ({
        clear() {
            strokes.current = [];
            currentStroke.current = [];

            redrawCanvas();

            setHandwritingData([]);
            setHandwritingImage(null);
        },

        exportImage() {

            if (!canvasRef.current) {
        
                return null;
        
            }
        
            const img =
                canvasRef.current.toDataURL("image/png");
        
            if (setHandwritingImage) {
        
                setHandwritingImage(img);
        
            }
        
            return img;
        
        },

        getStrokes() {

            return JSON.parse(
        
                JSON.stringify(
        
                    strokes.current
        
                )
        
            );
        
        },

        hasWriting() {

            return strokes.current.some(
    
                stroke =>
    
                    stroke.length > 1
    
            );
    
        },
    }));

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full touch-none select-none"
            style={{
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
            }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            onPointerLeave={end}
            onContextMenu={(e) => e.preventDefault()}
        />
    );
});

HandwritingCanvas.displayName = "HandwritingCanvas";

export default HandwritingCanvas;