import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

import { useAssessment } from "../../../contexts/AssessmentContext";

const HandwritingCanvas = forwardRef((props, ref) => {

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const drawing = useRef(false);
    const strokes = useRef([]);
    const currentStroke = useRef([]);

    const {
        setHandwritingData,
        setHandwritingImage,
    } = useAssessment();

    // ==========================================
    // Initialize Canvas
    // ==========================================
    useEffect(() => {

        const canvas = canvasRef.current;
        const ratio = window.devicePixelRatio || 1;

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;

        const ctx = canvas.getContext("2d");

        ctx.scale(ratio, ratio);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 3;

        contextRef.current = ctx;

    }, []);

    // ==========================================
    // Coordinates
    // ==========================================
    const getPoint = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            pressure: event.pressure || 0.5,
            timestamp: Date.now(),

        };

    };

    // ==========================================
    // Start Drawing
    // ==========================================
    const handlePointerDown = (event) => {

        event.preventDefault();

        drawing.current = true;

        const point = getPoint(event);

        currentStroke.current = [point];

        contextRef.current.beginPath();

        contextRef.current.moveTo(
            point.x,
            point.y
        );

    };

    // ==========================================
    // Drawing
    // ==========================================
    const handlePointerMove = (event) => {

        if (!drawing.current) return;

        event.preventDefault();

        const point = getPoint(event);

        currentStroke.current.push(point);

        contextRef.current.lineTo(
            point.x,
            point.y
        );
        contextRef.current.stroke();
    };

    // ==========================================
    // Finish Drawing
    // ==========================================
    const handlePointerUp = () => {

        if (!drawing.current) return;

        drawing.current = false;

        strokes.current.push(
            currentStroke.current
        );
        currentStroke.current = [];
        setHandwritingData(
            strokes.current
        );

        setHandwritingImage(
            canvasRef.current.toDataURL(
                "image/png"
            )
        );
    };

    // ==========================================
    // Public Methods
    // ==========================================
    useImperativeHandle(ref, () => ({
        clear() {
            const canvas = canvasRef.current;
            contextRef.current.clearRect(

                0,
                0,
                canvas.width,
                canvas.height

            );

            strokes.current = [];
            currentStroke.current = [];
            setHandwritingData([]);
            setHandwritingImage(null);
        },

        exportImage() {
            return canvasRef.current.toDataURL(
                "image/png"
            );
        },

        getStrokes() {
            return strokes.current;
        },
    }));

    return (

        <canvas
            ref={canvasRef}
            className="
                absolute
                inset-0
                w-full
                h-full
                touch-none
                cursor-crosshair
            "
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        />

    );
});

HandwritingCanvas.displayName =
    "HandwritingCanvas";

export default HandwritingCanvas;