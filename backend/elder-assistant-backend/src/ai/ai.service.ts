import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  generateInstruction(mode: string, screenTexts: string[]): string {
    if (mode === 'transfer_assist') {
      const hasTransfer = screenTexts.some(text =>
        text.toLowerCase().includes('transfer')
      );

      if (hasTransfer) {
        return 'Indica al usuario que toque el botón Transferir.';
      }

      return 'Busca un botón que diga Transferir o Enviar dinero.';
    }

    return 'Modo no reconocido.';
  }
}