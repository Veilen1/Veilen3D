import nodemailer from "nodemailer"

// ============================================================================
// Configuración
// ============================================================================

// Crear transporter según el entorno
function createTransporter() {
  // Si hay API key de Resend, usarlo (producción con dominio)
  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("xxx")) {
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    })
  }

  // Usar Gmail SMTP (desarrollo o sin dominio propio)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App Password, NO tu contraseña normal
    },
  })
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const APP_NAME = "Veilen 3D"

// ============================================================================
// Email de recuperación de contraseña
// ============================================================================

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`
  const fromEmail = process.env.FROM_EMAIL || process.env.GMAIL_USER || "noreply@veilen3d.com"

  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from: `"${APP_NAME}" <${fromEmail}>`,
      to: email,
      subject: `Recuperar contraseña - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperar contraseña</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 28px;">${APP_NAME}</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1a1a2e; margin-top: 0;">Hola ${userName},</h2>
              
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
              
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: #1a1a2e; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Restablecer contraseña
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Este enlace expirará en <strong>1 hora</strong> por seguridad.
              </p>
              
              <p style="color: #666; font-size: 14px;">
                Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña no será modificada.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; margin-bottom: 0;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="color: #999; font-size: 12px; word-break: break-all;">
                ${resetUrl}
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. Todos los derechos reservados.</p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Error enviando email:", error)
    return { success: false, error: "Error al enviar el email" }
  }
}
