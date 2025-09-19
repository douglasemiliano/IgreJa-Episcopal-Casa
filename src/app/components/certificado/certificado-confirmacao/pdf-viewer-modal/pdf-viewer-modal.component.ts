import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.scss']
})
export class PdfViewerModalComponent implements OnInit {
  safePdfUrl: SafeResourceUrl | null = null;
  private pdfBlob: Blob;
  private fileName: string;

  constructor(
    public dialogRef: MatDialogRef<PdfViewerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pdfBlob: Blob, fileName: string },
    private sanitizer: DomSanitizer
  ) {
    this.pdfBlob = data.pdfBlob;
    this.fileName = data.fileName;
  }

  ngOnInit(): void {
    const unsafeUrl = URL.createObjectURL(this.pdfBlob);
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  onCancel(): void { this.dialogRef.close(); }

  onDownload(): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(this.pdfBlob);
    link.download = this.fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}