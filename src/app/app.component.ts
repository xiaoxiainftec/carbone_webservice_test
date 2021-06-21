import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'carbonepdf';
  isProcessing = false;

  data={
    id: 1,
    date: "16/06/2021",
    company: {
      name: 'InfTec',
      address: 'Schönbühl',
      city: 'Bern',
      postalCode: 3000,
    },
    customer: {
      name: 'ICS protocol',
      address: 'ICS',
      city: 'ICS',
      postalCode: 3000,
    },
    products: [
      { name: 'product 1', priceUnit: 1, quantity: 10, priceTotal: 10 },
      { name: 'product 2', priceUnit: 5, quantity: 20, priceTotal: 100 },
    ],
    total: 150,
  };
  
 
  public async webservicePdf() {
    this.isProcessing = true;
    const url = await this.renderReportAndGetRenderId();
    await this.downloadPdf(url);
    this.isProcessing = false;
  }

  private downloadPdf(url: string) {
    var a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display:none';
   // const url=window.URL.createObjectURL(fileData);
    a.href = url;
    a.download = '';
    a.click();
  }

  public async renderReportAndGetRenderId() {
    const templateId = 'template'; // special template id for demo purpose
    const resp = await fetch(`https://render.carbone.io/render/${templateId}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: 'Bearer secret-token',
        'Content-Type': 'application/json',
        'Carbone-Version': '2',
      }),
      body: JSON.stringify({
        convertTo: 'pdf', // Convert the template to another file format
        data: this.data,
      }),
    }).then((res) => res.json());
    if (resp && resp.success === true && resp.data && resp.data.renderId) {
      // Get the result with a simple HTTP GET
      return `https://render.carbone.io/render/${resp.data.renderId}`;
    } else if (resp && resp.error) {
      return resp.error;
    }
  }
}
