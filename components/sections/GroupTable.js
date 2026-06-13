'use client';

import { motion } from 'framer-motion';
import Flag from '@/components/ui/Flag';

export default function GroupTable({ group, table = [] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-subtle px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg gold-gradient text-sm font-bold text-bg-primary">
          {group}
        </span>
        <span className="text-cardtitle font-semibold">Group {group}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-text-secondary">
              <th className="px-3 py-2 text-left font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">Team</th>
              <th className="px-2 py-2 text-center font-medium">P</th>
              <th className="px-2 py-2 text-center font-medium">W</th>
              <th className="px-2 py-2 text-center font-medium">D</th>
              <th className="px-2 py-2 text-center font-medium">L</th>
              <th className="px-2 py-2 text-center font-medium">GF</th>
              <th className="px-2 py-2 text-center font-medium">GA</th>
              <th className="px-2 py-2 text-center font-medium">GD</th>
              <th className="px-3 py-2 text-center font-bold text-gold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => {
              const qualifies = row.rank <= 2;
              return (
                <motion.tr
                  key={row.team.name + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border-t border-subtle ${qualifies ? 'bg-gold/5' : ''}`}
                >
                  <td className="px-3 py-2.5">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${
                        qualifies ? 'bg-gold text-bg-primary' : 'text-text-secondary'
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2">
                      <Flag team={row.team} size={22} />
                      <span className="font-medium text-text-primary">{row.team.name}</span>
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center tabular text-text-secondary">{row.played}</td>
                  <td className="px-2 py-2.5 text-center tabular">{row.win}</td>
                  <td className="px-2 py-2.5 text-center tabular">{row.draw}</td>
                  <td className="px-2 py-2.5 text-center tabular">{row.lose}</td>
                  <td className="px-2 py-2.5 text-center tabular text-text-secondary">{row.gf}</td>
                  <td className="px-2 py-2.5 text-center tabular text-text-secondary">{row.ga}</td>
                  <td className="px-2 py-2.5 text-center tabular">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td className="px-3 py-2.5 text-center tabular font-bold text-gold">{row.points}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
