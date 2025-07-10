import { BookingTransactions } from '@prisma/client'
import nodemailer from 'nodemailer'
import { Facility, Tours, ToursItinerary } from '../types/type'
import { MailtrapTransport  } from 'mailtrap'

type Receiver = {
  email: string
}

type Sender = {
  email: string
}

export const sendBookingEmail = async ({ bookingData, receiver, sender, tourData, itinerary, include, exclude, logo, baseUrl }: {
  bookingData: BookingTransactions
  receiver: Receiver
  sender: Sender
  tourData: Tours
  itinerary: ToursItinerary[]
  include: Facility[]
  exclude: Facility[]
  logo: string
  baseUrl: string
}) => {
  const TOKEN = process.env.EMAIL_PASS;

  const transporter = nodemailer.createTransport(
    MailtrapTransport({
      token: `${TOKEN}`,
    })
  )

  const itineraryHtml = itinerary
    .map(
      (item, index) => `
      <div style="margin-bottom: 15px;">
        <div style="font-weight: bold; color: #333;">Day ${index + 1}: ${item.title}</div>
        <div style="color: #555;">${item.description}</div>
      </div>
    `
    )
    .join('')

  const includeHtml = include.map((item) => `<li>${item.title}</li>`).join('')
  const excludeHtml = exclude.map((item) => `<li>${item.title}</li>`).join('')

  const emailHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f0f2f5;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      .container {
        max-width: 700px;
        margin: 0 auto;
        background-color: #fff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header img {
        max-height: 60px;
      }
      h2 {
        color: #3c096c;
        font-size: 24px;
        text-align: center;
        margin-bottom: 30px;
      }
      .section {
        margin-bottom: 30px;
        border: 1px solid #eee;
        padding: 20px;
        border-radius: 10px;
        background-color: #fafafa;
      }
      .section h3 {
        margin-top: 0;
        font-size: 18px;
        color: #3c096c;
        margin-bottom: 15px;
      }
      .details-table {
        width: 100%;
        border-collapse: collapse;
      }
      .details-table td {
        padding: 8px 0;
        vertical-align: top;
      }
      .details-table td:first-child {
        font-weight: 600;
        color: #333;
        width: 150px;
      }
      ul {
        margin: 0;
        padding-left: 20px;
      }
      li {
        margin-bottom: 6px;
      }
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #666;
        text-align: center;
        border-top: 1px solid #eee;
        padding-top: 20px;
      }
      a {
        color: #3c096c;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .container {
          padding: 20px;
        }
        .details-table td:first-child {
          width: 100px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logo}" alt="Company Logo" />
      </div>

      <h2>Your Booking</h2>

      <div class="section">
        <h3>Customer Information</h3>
        <table class="details-table">
          <tr><td>Name:</td><td>${bookingData.name}</td></tr>
          <tr><td>Email:</td><td>${bookingData.email}</td></tr>
          <tr><td>Phone:</td><td>${bookingData.phone_number}</td></tr>
          <tr><td>Message:</td><td>${bookingData.message || '-'}</td></tr>
        </table>
      </div>

      <div class="section">
        <h3>Booking Details</h3>
        <table class="details-table">
          <tr><td>Tour:</td><td>${tourData.title}</td></tr>
          <tr><td>Travel Date:</td><td>${bookingData.selectedDate.toLocaleDateString('en-GB')}</td></tr>
          <tr><td>Participants:</td><td>${bookingData.total_participant} person(s)</td></tr>
          <tr><td>Total Amount:</td><td>Rp ${bookingData.total_amount.toLocaleString('id-ID')}</td></tr>
          <tr><td>Tour Link:</td><td><a href="${baseUrl}/tours/${tourData.slug}" target="_blank">${baseUrl}/tours/${tourData.slug}</a></td></tr>
        </table>
      </div>

      <div class="section">
        <h3>Included in the Price</h3>
        <ul>${includeHtml}</ul>
      </div>

      <div class="section">
        <h3>Not Included</h3>
        <ul>${excludeHtml}</ul>
      </div>

      <div class="section">
        <h3>Itinerary</h3>
        ${itineraryHtml}
      </div>

      <div class="footer">
        Thank you for choosing us.<br />
        <strong>ExploreEase Team</strong>
      </div>
    </div>
  </body>
  </html>
  `

  await transporter.sendMail({
    from: `"Tour Booking" <${sender.email}>`,
    to: receiver.email,
    subject: `New Booking: ${bookingData.name} - ${tourData.title}`,
    html: emailHtml
  })
}
