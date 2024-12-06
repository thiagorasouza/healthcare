import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { getHoursStr } from "@/server/useCases/shared/helpers/date";
import { format } from "date-fns";

export const makeConfirmationEmail = (ap: AppointmentHydrated) => {
  return `  
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Appointment Confirmation</title>
    <!-- Google Font -->
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        color: #333;
      }
      .container {
        min-width: 400px;
        max-width: max-content;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 40px 20px 20px;
      }
      .header {
        text-align: center;
        margin-bottom: 40px;
      }
      .header h1 {
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
      .hero {
        text-align: center;
        margin-bottom: 40px;
      }
      .hero h1 {
        font-size: 16px;
        font-weight: 500;
        line-height: 1.75;
        margin-bottom: 4px;
      }
      .hero h2 {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 6px;
      }
      .hero p {
        font-size: 16px;
        color: #888;
        font-weight: 500;
      }
      .content {
        margin-bottom: 50px;
      }
      .card {
        border-radius: 24px;
        padding: 12px 0;
      }
      .card-title {
        font-size: 12px;
        font-weight: 600;
        color: #888;
        margin-bottom: 4px;
      }
      .card-content {
        font-size: 16px;
        font-weight: 500;
      }
      .badge {
        display: inline-block;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      .date-badge {
        background: #fcf0e2;
      }
      .hour-badge {
        background: #eaf8e7;
      }
      .patient-badge {
        background: #dcecfb;
      }

      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 20px;
      }

      .divider {
        display: none;
      }

      /* @media (min-width: 600px) {
        .content {
          flex-direction: row;
        }

        .divider {
          display: block;
          margin: 5% 0;
        }
      } */
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <img width="147" height="39" alt="Mednow logo" src="https://thiago-souza.com/img/mednow-logo-white.png"/>
      </div>

      <!-- Hero Section -->
      <div class="hero">
        <h1>Your appointment with</h1>
        <h2>Dr. ${ap.doctor.name}</h2>
        <p>${ap.doctor.specialty}</p>
      </div>

      <!-- Content Section -->
      <div class="content">
        <!-- Date and Time -->
        <div class="card" style="margin-bottom: 8px;">
          <!-- Date -->
          <div style="display: flex;">
            <div class="badge date-badge" style="margin-right: 12px; margin-top: 4px;"></div>
            <div>
              <p class="card-title">Date</p>
              <p class="card-content">${format(ap.startTime, "PPP")}</p>
            </div>
          </div>
        </div>
        <div class="card"  style="margin-bottom: 8px;">
          <!-- Time -->
          <div style="display: flex;">
            <div class="badge hour-badge"  style="margin-right: 12px; margin-top: 4px;"></div>
            <div>
              <p class="card-title">Hour</p>
              <p class="card-content">${getHoursStr(ap.startTime)}</p>
            </div>
          </div>
        </div>

        <!-- Patient Info -->
        <div class="card">
          <div style="display: flex; margin-bottom: 15px;">
            <div class="badge patient-badge" style="margin-right: 12px; margin-top: 4px;"></div>
            <div>
              <p class="card-title">Patient</p>
              <p class="card-content" style="font-weight: 600;">${ap.patient.name}</p>
            </div>
          </div>
          <div style="line-height: 1.75;">
            <p>
              <span style="color: #819191">Email:</span> ${ap.patient.email}
            </p>
            <p>
              <span style="color: #819191">Phone:</span> ${ap.patient.phone}
            </p>
            <p>
              <span style="color: #819191">Insurance:</span> ${ap.patient.insuranceProvider}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        &copy; 2024 Mednow. All rights reserved.
      </div>
    </div>
  </body>
</html>
  `;
};
