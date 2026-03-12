"use client";

import { useEffect, useRef, useState } from "react";

/** 3D треугольная призма: 2 треугольника (перед/зад) + 3 боковые грани. Вершина вверх по Y. */
function buildPrism(
  cx: number,
  cy: number,
  size: number,
  thickness: number,
  r: number,
  g: number,
  b: number,
  a: number,
  out: number[]
) {
  const h = size * (Math.sqrt(3) / 2);
  const t2 = thickness / 2;

  // Локальные вершины треугольника (вершина вверх)
  const p0 = [0, size, 0] as const;
  const p1 = [-h, -size / 2, 0] as const;
  const p2 = [h, -size / 2, 0] as const;

  const push = (
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number,
    cr: number,
    cg: number,
    cb: number,
    ca: number
  ) => {
    out.push(cx + x, cy + y, z, nx, ny, nz, cr, cg, cb, ca);
  };

  // Передняя грань (z = -t2, нормаль 0,0,-1)
  push(p0[0], p0[1], -t2, 0, 0, -1, r, g, b, a);
  push(p1[0], p1[1], -t2, 0, 0, -1, r, g, b, a);
  push(p2[0], p2[1], -t2, 0, 0, -1, r, g, b, a);

  // Задняя грань (z = t2, нормаль 0,0,1)
  push(p0[0], p0[1], t2, 0, 0, 1, r, g, b, a);
  push(p2[0], p2[1], t2, 0, 0, 1, r, g, b, a);
  push(p1[0], p1[1], t2, 0, 0, 1, r, g, b, a);

  // Нормали для боковых граней (перпендикуляр ребру и Z)
  const norm = (v: [number, number]) => {
    const len = Math.hypot(v[0], v[1]);
    return len > 0 ? [v[0] / len, v[1] / len] : [0, 0];
  };
  const n01 = norm([p1[1] - p0[1], -(p1[0] - p0[0])]);
  const n12 = norm([p2[1] - p1[1], -(p2[0] - p1[0])]);
  const n20 = norm([p0[1] - p2[1], -(p0[0] - p2[0])]);

  // Боковая грань p0-p1
  push(p0[0], p0[1], -t2, n01[0], n01[1], 0, r, g, b, a * 0.85);
  push(p1[0], p1[1], -t2, n01[0], n01[1], 0, r, g, b, a * 0.85);
  push(p1[0], p1[1], t2, n01[0], n01[1], 0, r, g, b, a * 0.85);
  push(p0[0], p0[1], -t2, n01[0], n01[1], 0, r, g, b, a * 0.85);
  push(p1[0], p1[1], t2, n01[0], n01[1], 0, r, g, b, a * 0.85);
  push(p0[0], p0[1], t2, n01[0], n01[1], 0, r, g, b, a * 0.85);

  // Боковая грань p1-p2
  push(p1[0], p1[1], -t2, n12[0], n12[1], 0, r, g, b, a * 0.85);
  push(p2[0], p2[1], -t2, n12[0], n12[1], 0, r, g, b, a * 0.85);
  push(p2[0], p2[1], t2, n12[0], n12[1], 0, r, g, b, a * 0.85);
  push(p1[0], p1[1], -t2, n12[0], n12[1], 0, r, g, b, a * 0.85);
  push(p2[0], p2[1], t2, n12[0], n12[1], 0, r, g, b, a * 0.85);
  push(p1[0], p1[1], t2, n12[0], n12[1], 0, r, g, b, a * 0.85);

  // Боковая грань p2-p0
  push(p2[0], p2[1], -t2, n20[0], n20[1], 0, r, g, b, a * 0.85);
  push(p0[0], p0[1], -t2, n20[0], n20[1], 0, r, g, b, a * 0.85);
  push(p0[0], p0[1], t2, n20[0], n20[1], 0, r, g, b, a * 0.85);
  push(p2[0], p2[1], -t2, n20[0], n20[1], 0, r, g, b, a * 0.85);
  push(p0[0], p0[1], t2, n20[0], n20[1], 0, r, g, b, a * 0.85);
  push(p2[0], p2[1], t2, n20[0], n20[1], 0, r, g, b, a * 0.85);
}

function perspective(fovYRad: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovYRad / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Float32Array {
  const out = new Float32Array(16);
  const lr = 1 / (left - right);
  const bt = 1 / (bottom - top);
  const nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[5] = -2 * bt;
  out[10] = 2 * nf;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

function lookAt(eyeX: number, eyeY: number, eyeZ: number, atX: number, atY: number, atZ: number): Float32Array {
  const out = new Float32Array(16);
  const zx = atX - eyeX;
  const zy = atY - eyeY;
  const zz = atZ - eyeZ;
  let len = Math.hypot(zx, zy, zz);
  if (len > 0) {
    len = 1 / len;
    const z = [zx * len, zy * len, zz * len];
    const x = [-z[1], z[0], 0];
    len = Math.hypot(x[0], x[1]);
    if (len > 0) {
      x[0] /= len;
      x[1] /= len;
    }
    const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
    out[0] = x[0];
    out[4] = x[1];
    out[8] = x[2];
    out[1] = y[0];
    out[5] = y[1];
    out[9] = y[2];
    out[2] = -z[0];
    out[6] = -z[1];
    out[10] = -z[2];
    out[12] = -x[0] * eyeX - x[1] * eyeY - x[2] * eyeZ;
    out[13] = -y[0] * eyeX - y[1] * eyeY - y[2] * eyeZ;
    out[14] = z[0] * eyeX + z[1] * eyeY + z[2] * eyeZ;
    out[15] = 1;
  } else {
    out[0] = out[5] = out[10] = out[15] = 1;
  }
  return out;
}

function multiply4(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[i * 4 + j] =
        a[i * 4 + 0] * b[0 * 4 + j] +
        a[i * 4 + 1] * b[1 * 4 + j] +
        a[i * 4 + 2] * b[2 * 4 + j] +
        a[i * 4 + 3] * b[3 * 4 + j];
    }
  }
  return out;
}

function translation(tx: number, ty: number, tz: number): Float32Array {
  const out = new Float32Array(16);
  out[0] = out[5] = out[10] = out[15] = 1;
  out[12] = tx;
  out[13] = ty;
  out[14] = tz;
  return out;
}

const FLOATS_PER_VERTEX = 10; // pos(3), normal(3), color(4)

/**
 * WebGL: настоящие 3D треугольные призмы (грани, рёбра), центральная + 8 по кругу, стеклянный материал.
 * smallOnly: только 8 маленьких по кругу, без центрального большого треугольника.
 * transparentBackground: прозрачный фон канваса (для вставки в светлые/тёмные блоки без чёрного прямоугольника).
 */
export function HeroTriangleWebGL({
  className,
  smallOnly,
  transparentBackground,
  width: widthProp,
  height: heightProp,
}: {
  className?: string;
  smallOnly?: boolean;
  transparentBackground?: boolean;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: widthProp, height: heightProp });
  sizeRef.current = { width: widthProp, height: heightProp };
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, depth: true, preserveDrawingBuffer: false });
    if (!gl) {
      setWebglError("WebGL недоступен");
      return;
    }
    setWebglError(null);

    const vertexSource = `
      attribute vec3 a_position;
      attribute vec3 a_normal;
      attribute vec4 a_color;
      uniform mat4 u_mvp;
      varying vec3 v_normal;
      varying vec4 v_color;
      varying vec3 v_pos;
      void main() {
        gl_Position = u_mvp * vec4(a_position, 1.0);
        v_normal = a_normal;
        v_color = a_color;
        v_pos = a_position;
      }
    `;
    const fragmentSource = `
      precision mediump float;
      varying vec3 v_normal;
      varying vec4 v_color;
      varying vec3 v_pos;
      uniform vec3 u_lightDir;
      void main() {
        vec3 n = normalize(v_normal);
        float diff = max(0.0, dot(n, u_lightDir));
        vec3 lit = v_color.rgb * (0.45 + 0.5 * diff);
        float rim = 1.0 - abs(dot(n, normalize(-v_pos)));
        rim = smoothstep(0.0, 0.65, rim);
        lit += rim * 0.35;
        float alpha = v_color.a * (0.4 + 0.35 * diff + 0.4 * rim);
        gl_FragColor = vec4(lit, min(alpha, 0.92));
      }
    `;

    const vert = gl.createShader(gl.VERTEX_SHADER);
    if (!vert) return;
    gl.shaderSource(vert, vertexSource);
    gl.compileShader(vert);
    if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
      console.error("Vertex shader:", gl.getShaderInfoLog(vert));
      return;
    }

    const frag = gl.createShader(gl.FRAGMENT_SHADER);
    if (!frag) return;
    gl.shaderSource(frag, fragmentSource);
    gl.compileShader(frag);
    if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
      console.error("Fragment shader:", gl.getShaderInfoLog(frag));
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const normalLoc = gl.getAttribLocation(program, "a_normal");
    const colorLoc = gl.getAttribLocation(program, "a_color");
    const mvpLoc = gl.getUniformLocation(program, "u_mvp");
    const lightDirLoc = gl.getUniformLocation(program, "u_lightDir");

    const allVertices: number[] = [];
    if (!smallOnly) {
      const centerSize = 0.38;
      const centerThick = 0.2;
      buildPrism(0, 0, centerSize, centerThick, 1, 0.84, 0, 0.6, allVertices);
    }

    const numSmall = 8;
    const radius = 0.68;
    const smallSize = 0.11;
    const smallThick = 0.12;
    const colors: [number, number, number, number][] = [
      [0.4, 0.85, 0.95, 0.9],
      [0.6, 0.4, 1, 0.9],
      [0.2, 0.9, 0.5, 0.9],
      [1, 0.5, 0.25, 0.9],
      [1, 0.75, 0.2, 0.9],
      [0.25, 0.65, 1, 0.9],
      [0.5, 1, 0.6, 0.85],
      [1, 0.4, 0.6, 0.9],
    ];

    for (let i = 0; i < numSmall; i++) {
      const angle = (i / numSmall) * Math.PI * 2 - Math.PI / 2;
      const cx = radius * Math.cos(angle);
      const cy = radius * Math.sin(angle);
      const [r, g, b, a] = colors[i % colors.length];
      buildPrism(cx, cy, smallSize, smallThick, r, g, b, a, allVertices);
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allVertices), gl.STATIC_DRAW);
    const strideBytes = FLOATS_PER_VERTEX * 4;

    function render() {
      if (!canvas || !gl) return;
      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) return;

      gl.viewport(0, 0, w, h);
      gl.clearColor(0.05, 0.06, 0.12, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const aspect = w / h;
      const scale = 1.0;
      const proj = ortho(-scale * aspect, scale * aspect, -scale, scale, -3, 3);
      const view = translation(0, 0, -1.5);
      const mvp = multiply4(proj, view);

      gl.uniformMatrix4fv(mvpLoc, false, mvp);
      gl.uniform3f(lightDirLoc, 0.4, 0.6, 0.7);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, strideBytes, 0);
      gl.enableVertexAttribArray(normalLoc);
      gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, strideBytes, 3 * 4);
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, strideBytes, 6 * 4);

      gl.drawArrays(gl.TRIANGLES, 0, allVertices.length / FLOATS_PER_VERTEX);
    }

    const fallbackSize = 300;
    function resize() {
      if (!canvas) return;
      const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1);
      const { width: wProp, height: hProp } = sizeRef.current;
      let w: number;
      let h: number;
      if (wProp != null && hProp != null && wProp > 0 && hProp > 0) {
        w = Math.round(wProp * dpr);
        h = Math.round(hProp * dpr);
      } else {
        const rect = canvas.getBoundingClientRect();
        w = Math.round(rect.width * dpr);
        h = Math.round(rect.height * dpr);
        if (w <= 0 || h <= 0) {
          w = Math.max(fallbackSize, canvas.width || fallbackSize);
          h = Math.max(fallbackSize, canvas.height || fallbackSize);
        }
      }
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      render();
    }

    resize();
    const rafId = requestAnimationFrame(() => resize());
    const timeoutId = setTimeout(() => resize(), 200);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(posBuf);
    };
  }, [smallOnly]);

  if (webglError) {
    return (
      <div
        className={className}
        style={{ minWidth: "260px", minHeight: "260px", background: "rgba(251,215,1,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", fontSize: "14px" }}
        aria-hidden
      >
        {webglError}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={widthProp ?? undefined}
      height={heightProp ?? undefined}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minWidth: widthProp ?? 260,
        minHeight: heightProp ?? 260,
        display: "block",
        background: transparentBackground
          ? "transparent"
          : smallOnly
            ? "rgba(26, 29, 46, 0.92)"
            : "#0d0f1a",
      }}
      aria-hidden
    />
  );
}
